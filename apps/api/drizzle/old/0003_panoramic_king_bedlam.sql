-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION r4.add_to_history()
RETURNS TRIGGER AS $$
DECLARE
  history_table text := TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME || '_history';
  sql text;
BEGIN
  sql := 'INSERT INTO ' || history_table || ' SELECT ($1).*';
  EXECUTE sql USING OLD;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint

CREATE TRIGGER before_implementationguide_update
BEFORE UPDATE ON r4.implementationguide
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_codesystem_update
BEFORE UPDATE ON r4.codesystem
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_valueset_update
BEFORE UPDATE ON r4.valueset
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_list_update
BEFORE UPDATE ON r4.list
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_namingsystem_update
BEFORE UPDATE ON r4.namingsystem
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_structuredefinition_update
BEFORE UPDATE ON r4.structuredefinition
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_organization_update
BEFORE UPDATE ON r4.organization
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_careteam_update
BEFORE UPDATE ON r4.careteam
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_location_update
BEFORE UPDATE ON r4.location
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_person_update
BEFORE UPDATE ON r4.person
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_relatedperson_update
BEFORE UPDATE ON r4.relatedperson
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_practitioner_update
BEFORE UPDATE ON r4.practitioner
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

CREATE TRIGGER before_patient_update
BEFORE UPDATE ON r4.patient
FOR EACH ROW
EXECUTE FUNCTION r4.add_to_history();--> statement-breakpoint

