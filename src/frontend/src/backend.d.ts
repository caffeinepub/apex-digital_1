import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProjectSubmission {
    transactionHash: string;
    paymentStatus: string;
    numberOfPages: string;
    additionalNotes: string;
    clientName: string;
    projectDescription: string;
    package: string;
    needsBranding: boolean;
    whatTheyNeed: string;
    needsBooking: boolean;
    businessName: string;
    businessType: string;
    needsPaymentIntegration: boolean;
    email: string;
    currentWebsite: string;
    needsDashboard: boolean;
    needsContentWriting: boolean;
    projectId: string;
    timestamp: bigint;
    needsContactForm: boolean;
    contentReadiness: string;
    inspirationLinks: string;
    timeline: string;
}
export interface Contact {
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface backendInterface {
    getContacts(): Promise<Array<Contact>>;
    getProjects(): Promise<Array<ProjectSubmission>>;
    submitContact(name: string, email: string, message: string): Promise<void>;
    submitProject(package: string, clientName: string, email: string, businessName: string, currentWebsite: string, businessType: string, whatTheyNeed: string, projectDescription: string, numberOfPages: string, needsContactForm: boolean, needsBooking: boolean, needsPaymentIntegration: boolean, needsDashboard: boolean, needsContentWriting: boolean, needsBranding: boolean, inspirationLinks: string, timeline: string, contentReadiness: string, additionalNotes: string): Promise<string>;
    updatePaymentStatus(projectId: string, status: string, txHash: string): Promise<boolean>;
}
