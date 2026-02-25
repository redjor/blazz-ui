/**
 * Base user type (inlined from use-session hook for package independence)
 */
interface BaseUser {
	id: string
	email: string
	name: string
	firstName: string | null
	lastName: string | null
	role: string
	branch?: string | null
}

/**
 * Extended User type for user management
 */
export interface User extends BaseUser {
	username: string
	avatar?: string
	status: "active" | "inactive" | "suspended" | "never_active"
	emailAddresses: EmailAddress[]
	metadata: UserMetadata
	permissions: UserPermissions
	lastSignedIn?: string
	createdAt: string
	updatedAt: string
	devices: Device[]
}

/**
 * Email address with verification status
 */
export interface EmailAddress {
	id: string
	email: string
	isPrimary: boolean
	isVerified: boolean
	createdAt: string
}

/**
 * User metadata
 */
export interface UserMetadata {
	public: Record<string, any>
	private: Record<string, any>
	unsafe: Record<string, any>
}

/**
 * User permissions
 */
export interface UserPermissions {
	canDeleteAccount: boolean
	bypassClientTrust: boolean
}

/**
 * Device information
 */
export interface Device {
	id: string
	name: string
	type: string
	lastUsed: string
}

/**
 * Invitation interface
 */
export interface Invitation {
	id: string
	email: string
	role: string
	status: "pending" | "accepted" | "expired" | "revoked"
	invitedAt: string
	expiresAt: string
	invitedBy: string
}

/**
 * Form data for inviting a user
 */
export interface InviteUserFormData {
	email: string
	role: string
	sendEmail: boolean
}

/**
 * Form data for creating a user
 */
export interface CreateUserFormData {
	email: string
	firstName: string
	lastName: string
	username: string
	role: string
	password: string
	sendVerificationEmail: boolean
}

/**
 * Form data for updating user profile
 */
export interface UpdateUserProfileFormData {
	firstName: string
	lastName: string
	avatar?: string
}

/**
 * Form data for updating user metadata
 */
export interface UpdateUserMetadataFormData {
	public: Record<string, any>
	private: Record<string, any>
	unsafe: Record<string, any>
}
