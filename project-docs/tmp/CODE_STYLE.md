```markdown
# Code Style Guidelines for smedrec-app

## 1. File Organization

### Directory Structure
```

/src
├── app # App Router routes
├── components # Reusable components
│ └── ui # shadcn components
├── hooks # Custom hooks
├── lib # Utilities/config
├── stores # Zustand stores
├── types # TypeScript types
├── public # Static assets
└── styles # Global CSS

````

### File Naming
- Components: `PascalCase` with directory (e.g., `PatientForm/index.tsx`)
- Hooks: `useCamelCase.ts` (e.g., `usePatientData.ts`)
- Tests: `FileName.test.tsx` colocated with source

### Import Order
```typescript
// 1. External dependencies
import { zustand } from 'zustand'

// 2. Internal components
import PatientForm from '@/components/PatientForm'

// 3. Utilities/types
import { Patient } from '@/types'
import { formatDate } from '@/lib/utils'
````

## 2. Code Formatting

- Indentation: 2 spaces
- Quotes: Single (`'`)
- Semicolons: Required
- Line length: 100 characters
- Trailing commas: ES5
- Tailwind class ordering: [Headwind](https://github.com/heybourn/headwind) pattern

.eslintrc

```json
{
	"extends": ["next/core-web-vitals", "prettier"],
	"rules": {
		"react-hooks/exhaustive-deps": "error"
	}
}
```

## 3. Naming Conventions

| Element        | Convention        | Example             |
| -------------- | ----------------- | ------------------- |
| Component      | PascalCase        | `PatientProfile`    |
| Custom Hook    | `useCamelCase`    | `useFormValidation` |
| Zustand Store  | `useStore` suffix | `usePatientStore`   |
| Constants      | UPPER_SNAKE_CASE  | `MAX_RECORDS`       |
| Type/Interface | PascalCase        | `PatientData`       |

## 4. TypeScript Guidelines

### Strict Requirements

```json
// tsconfig.json
{
	"compilerOptions": {
		"strict": true,
		"noImplicitAny": true,
		"strictNullChecks": true
	}
}
```

### Error Handling

```typescript
// Custom error class
export class FormValidationError extends Error {
	constructor(
		public field: string,
		message: string
	) {
		super(message)
		this.name = 'FormValidationError'
	}
}

// API response type
type ApiResponse<T> = {
	data?: T
	error?: {
		code: number
		message: string
	}
}
```

## 5. Component Guidelines

### shadcn/Tailwind Implementation

```tsx
import { Button } from '@/components/ui/button'

export default function PatientCard({ patient }: { patient: Patient }) {
	return (
		<div className="bg-card rounded-lg p-4 shadow-sm">
			<h3 className="text-lg font-semibold">{patient.name}</h3>
			<Button variant="outline" className="mt-2">
				View Details
			</Button>
		</div>
	)
}
```

### Zustand Store Pattern

```typescript
import { create } from 'zustand'

type PatientStore = {
	patients: Patient[]
	addPatient: (patient: Patient) => void
	fetchPatients: () => Promise<void>
}

export const usePatientStore = create<PatientStore>((set) => ({
	patients: [],
	addPatient: (patient) =>
		set((state) => ({
			patients: [...state.patients, patient],
		})),
	fetchPatients: async () => {
		const { data } = await axios.get<Patient[]>('/api/patients')
		set({ patients: data })
	},
}))
```

## 6. Documentation Standards

### JSDoc Example

```typescript
/**
 * Validates patient form data against medical requirements
 * @param {PatientFormData} formData - Raw form input
 * @returns {ValidationResult} Object containing validation status and errors
 * @throws {FormValidationError} For critical validation failures
 */
export function validatePatientForm(formData: PatientFormData): ValidationResult {
	// Implementation
}
```

## 7. Testing Standards

### Component Test Example

```tsx
import { render, screen } from '@testing-library/react'

import PatientForm from './PatientForm'

describe('PatientForm', () => {
	it('validates required fields', async () => {
		// Arrange
		render(<PatientForm />)

		// Act
		userEvent.click(screen.getByRole('button', { name: /submit/i }))

		// Assert
		expect(await screen.findByText('Name is required')).toBeVisible()
	})
})
```

## 8. Performance Guidelines

### Dynamic Imports

```tsx
const PatientChart = dynamic(() => import('@/components/PatientChart'), {
	loading: () => <Skeleton className="h-[400px] w-full" />,
	ssr: false,
})
```

### SWR Data Fetching

```tsx
function PatientList() {
	const { data, error } = useSWR('/api/patients', fetcher, {
		revalidateOnFocus: false,
		dedupingInterval: 60000,
	})

	// Render logic
}
```

## 9. Security Guidelines

### Input Sanitization

```typescript
import DOMPurify from 'dompurify'

const cleanHTML = DOMPurify.sanitize(userInput, {
	ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
	ALLOWED_ATTR: [],
})
```

## 10. Development Workflow

### Git Commit Message

```
feat(patient): add critical condition flag
fix(form): resolve date validation edge case
chore: update jest dependencies
```

## Enforcement Tools

### Pre-commit Hook

```bash
#!/bin/sh
npm run lint
npm run type-check
npm test -- --findRelatedTests
```

### IDE Configuration

.vscode/settings.json

```json
{
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": true
	},
	"tailwindCSS.experimental.classRegex": [["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]]
}
```

---

This style guide:  
✅ Enforces strict type safety  
✅ Optimizes for Next.js 14 features  
✅ Maintains shadcn/ui consistency  
✅ Implements healthcare security standards  
✅ Streamlines team collaboration

Update annually or when major stack changes occur.

```

```
