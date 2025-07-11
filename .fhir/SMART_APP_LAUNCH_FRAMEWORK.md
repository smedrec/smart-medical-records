# SMART App Launch Framework

The SMART App Launch Framework connects third-party applications to Electronic Health Record data, allowing apps to launch from inside or outside the user interface of an EHR system. The framework supports apps for use by clinicians, patients, and others via a PHR or Patient Portal or any FHIR system where a user can give permissions to launch an app. It provides a reliable, secure authorization protocol for a variety of app architectures, including apps that run on an end-user’s device as well as apps that run on a secure server. The Launch Framework supports the four uses cases defined for Phase 1 of the Argonaut Project:

    1. Patients apps that launch standalone
    2. Patient apps that launch from a portal
    3. Provider apps that launch standalone
    4. Provider apps that launch from a portal

## 1 - Profile audience and scope

This profile is intended to be used by developers of apps that need to access FHIR resources by requesting access tokens from OAuth 2.0 compliant authorization servers. It is compatible with FHIR DSTU2 and above, and includes explicit definitions for extensions in DSTU2 and STU3.

OAuth 2.0 authorization servers are configured to mediate access based on a set of rules configured to enforce institutional policy, which may include requesting end-user authorization. This profile does not dictate the institutional policies that are implemented in the authorization server.

The profile defines a method through which an app requests authorization to access a FHIR resource, and then uses that authorization to retrieve the resource. Synchronization of patient context is not addressed. In other words, if the patient chart is changed during the session, the application will not inherently be updated. Other security mechanisms, such as those mandated by HIPAA in the US (end-user authentication, session time-out, security auditing, and accounting of disclosures) are outside the scope of this profile.

## 2 - App protection

The app is responsible for protecting itself from potential misbehaving or malicious values passed to its redirect URL (e.g., values injected with executable code, such as SQL) and for protecting authorization codes, access tokens, and refresh tokens from unauthorized access and use. The app developer must be aware of potential threats, such as malicious apps running on the same platform, counterfeit authorization servers, and counterfeit resource servers, and implement countermeasures to help protect both the app itself and any sensitive information it may hold. For background, see the OAuth 2.0 Threat Model and Security Considerations.

    Apps SHALL ensure that sensitive information (authentication secrets, authorization codes, tokens) is transmitted ONLY to authenticated servers, over TLS-secured channels.

    Apps SHALL generate an unpredictable state parameter for each user session. An app SHALL validate the state value for any request sent to its redirect URL; include state with all authorization requests; and validate the state value included in access tokens it receives.

    An app SHALL NOT execute any inputs it receives as code.

    An app SHALL NOT forward values passed back to its redirect URL to any other arbitrary or user-provided URL (a practice known as an “open redirector”).

    An app SHALL NOT store bearer tokens in cookies that are transmitted in the clear.

    Apps should persist tokens and other sensitive data in app-specific storage locations only, not in system-wide-discoverable locations.

## 3 - Support for “public” and “confidential” apps

Within this profile we differentiate between the two types of apps defined in the OAuth 2.0 specification: confidential and public. The differentiation is based upon whether the execution environment within which the app runs enables the app to protect secrets. Pure client-side apps (for example, HTML5/JS browser-based apps, iOS mobile apps, or Windows desktop apps) can provide adequate security, but they may be unable to “keep a secret” in the OAuth2 sense. In other words, any “secret” key, code, or string that is statically embedded in the app can potentially be extracted by an end-user or attacker. Hence security for these apps cannot depend on secrets embedded at install-time.

For strategies and best practices to protecting a client secret refer to:

    OAuth 2.0 Threat Model and Security Considerations: 4.1.1. Threat: Obtaining Client Secrets
    OAuth 2.0 for Native Apps: 8.5. Client Authentication
    OAuth 2.0 Dynamic Client Registration Protocol

### 3.0.1 Use the confidential app profile if your app is able to protect a client_secret

for example:

    App runs on a trusted server with only server-side access to the secret
    App is a native app that uses additional technology (such as dynamic client registration and universal redirect_uris) to protect the client_secret

### 3.0.2 Use the public app profile if your app is unable to protect a client_secret

for example:

    App is an HTML5 or JS in-browser app that would expose the secret in user space
    App is a native app that can only distribute a client_secret statically

## 4 - Registering a SMART App with an EHR

Before a SMART app can run against an EHR, the app must be registered with that EHR’s authorization service. SMART does not specify a standards-based registration process, but we encourage EHR implementers to consider the OAuth 2.0 Dynamic Client Registration Protocol for an out-of-the-box solution.

No matter how an app registers with an EHR’s authorization service, at registration time every SMART app must:

    Register zero or more fixed, fully-specified launch URL with the EHR’s authorization server
    Register one or more fixed, fully-specified redirect_uris with the EHR’s authorization server. Note: In the case of native clients following the OAuth 2.0 for Native Apps specification (RFC 8252), it may be appropriate to leave the port as a dynamic variable in an otherwise fixed redirect URI.

## 5 - SMART authorization & FHIR access: overview

An app can launch from within an existing EHR or Patient Portal session; this is known as an EHR launch. Alternatively, it can launch as a standalone app.

In an EHR launch, an opaque handle to the EHR context is passed along to the app as part of the launch URL. The app later will include this context handle as a request parameter when it requests authorization to access resources. Note that the complete URLs of all apps approved for use by users of this EHR will have been registered with the EHR authorization server.

Alternatively, in a standalone launch, when the app launches from outside an EHR session, the app can request context from the EHR authorization server during the authorization process described below.

Once an app receives a launch request, it requests authorization to access a FHIR resource by causing the browser to navigate to the EHR’s authorization endpoint. Based on pre-defined rules and possibly end-user authorization, the EHR authorization server either grants the request by returning an authorization code to the app’s redirect URL, or denies the request. The app then exchanges the authorization code for an access token, which the app presents to the EHR’s resource server to access requested FHIR resources. If a refresh token is returned along with the access token, the app may use this to request a new access token, with the same scope, once the access token expires.

## 6 - SMART “launch sequence”

The two alternative launch sequences are described below.

### 6.1 - EHR launch sequence

[EHR launch sequence](cdraw.png)

In SMART’s EHR launch flow (shown above), a user has established an EHR session, and then decides to launch an app. This could be a single-patient app (which runs in the context of a patient record), or a user-level app (like an appointment manager or a population dashboard). The EHR initiates a “launch sequence” by opening a new browser instance (or iframe) pointing to the app’s registered launch URL and passing some context.

The following parameters are included:

| Parameter | Required | Description |
iss required URL of the EHR’s authorization server.
launch required Opaque identifier for this specific launch, and any EHR context associated with it. This parameter must be communicated back to the EHR at authorization time by passing along a launch parameter (see example below).

#### 6.1.1

A launch might cause the browser to navigate to:

```
Location: https://app/launch?iss=https%3A%2F%2Fehr%2Ffhir&launch=xyz123
```

On receiving the launch notification, the app would query the issuer’s /metadata/ endpoint or .well-known/smart-configuration.json endpoint which contains (among other details) the EHR’s identifying the OAuth authorize and token endpoint URLs for use in requesting authorization to access FHIR resources.

Later, when the app prepares a list of access scopes to request from the EHR authorization server, it will be associated with the existing EHR context by including the launch notification in the scope.

### 6.2 Standalone launch sequence

[Standalone launch sequence](standalone.png)

Alternatively, in SMART’s standalone launch flow (shown above), a user selects an app from outside the EHR, for example by tapping an app icon on a mobile phone home screen. This app will launch from its registered URL without a launch id.

In order to obtain launch context and request authorization to access FHIR resources, the app discovers the EHR authorization server’s OAuth authorize and token endpoint URLs by querying their .well-known/smart-configuration.json file.

The app then can declare its launch context requirements by adding specific scopes to the request it sends to the EHR’s authorization server. The authorize endpoint will acquire the context the app needs and make it available.

#### 6.2.1 For example:

If the app needs patient context, the EHR’s authorization server may provide the end-user with a patient selection widget. For full details, see SMART launch context parameters.

    launch/patient - to indicate that the app needs to know a patient ID
    launch/encounter - to indicate the app needs an encounter

## 7 - SMART authorization and resource retrieval

### 7.1 SMART authorization sequence

[SMART authorization sequence](smart-authorization-sequence.png)

#### 7.1.1 Step 1: App asks for authorization

At launch time, the app constructs a request for authorization by adding the following parameters to the query component of the EHR’s “authorize” endpoint URL.:

| Parameter | Required | Description |
| response_type | required | Fixed value: code. |
| client_id | required | The client's identifier.
| redirect_uri | required | Must match one of the client's pre-registered redirect URIs. |
| launch | optional | When using the EHR launchflow, this must match the launch value received from the EHR. |
| scope | required | Must describe the access that the app needs, including clinical data scopes like patient/\*.read, openid and fhirUser (if app needs authenticated patient identity) and either:

    a launch value indicating that the app wants to receive already-established launch context details from the EHR
    a set of launch context requirements in the form launch/patient, which asks the EHR to establish context on your behalf.

| state | required | An opaque value used to maintain state between the EHR and the app.
See SMART on FHIR Access Scopes details. The authorization server includes this value when redirecting the user-agent back to the client. The parameter SHALL be used for preventing cross-site request forgery or session fixation attacks.
| aud | optional | URL of the EHR resource server from which the app wishes to retrieve FHIR data. This parameter prevents leaking a genuine bearer token to a counterfeit resource server. (Note: in the case of an EHR launch flow, this aud value is the same as the launch's iss value.) |

The app SHALL use an unpredictable value for the state parameter with at least 122 bits of entropy (e.g., a properly configured random uuid is suitable). The app SHALL validate the value of the state parameter upon return to the redirect URL and SHALL ensure that the state value is securely tied to the user’s current session (e.g., by relating the state value to a session identifier issued by the app). The app SHOULD limit the grants, scope, and period of time requested to the minimum necessary.

If the app needs to authenticate the identity of the end-user, it should include two OpenID Connect scopes: openid and fhirUser. When these scopes are requested, and the request is granted, the app will receive an id_token along with the access token. For full details, see SMART launch context parameters.
