import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

actor {
  type Contact = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  type ProjectSubmission = {
    projectId : Text;
    package_ : Text;
    clientName : Text;
    email : Text;
    businessName : Text;
    currentWebsite : Text;
    businessType : Text;
    whatTheyNeed : Text;
    projectDescription : Text;
    numberOfPages : Text;
    needsContactForm : Bool;
    needsBooking : Bool;
    needsPaymentIntegration : Bool;
    needsDashboard : Bool;
    needsContentWriting : Bool;
    needsBranding : Bool;
    inspirationLinks : Text;
    timeline : Text;
    contentReadiness : Text;
    additionalNotes : Text;
    paymentStatus : Text;
    transactionHash : Text;
    timestamp : Int;
  };

  module Contact {
    public func compareByTimestamp(a : Contact, b : Contact) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module Project {
    public func compareByTimestamp(a : ProjectSubmission, b : ProjectSubmission) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let contacts = Map.empty<Int, Contact>();
  let projects = Map.empty<Text, ProjectSubmission>();
  var projectCounter : Nat = 0;

  public shared func submitContact(name : Text, email : Text, message : Text) : async () {
    let timestamp = Time.now();
    let contact : Contact = { name; email; message; timestamp };
    contacts.add(timestamp, contact);
  };

  public query func getContacts() : async [Contact] {
    contacts.values().toArray().sort(Contact.compareByTimestamp);
  };

  public shared func submitProject(
    package_ : Text,
    clientName : Text,
    email : Text,
    businessName : Text,
    currentWebsite : Text,
    businessType : Text,
    whatTheyNeed : Text,
    projectDescription : Text,
    numberOfPages : Text,
    needsContactForm : Bool,
    needsBooking : Bool,
    needsPaymentIntegration : Bool,
    needsDashboard : Bool,
    needsContentWriting : Bool,
    needsBranding : Bool,
    inspirationLinks : Text,
    timeline : Text,
    contentReadiness : Text,
    additionalNotes : Text
  ) : async Text {
    let timestamp = Time.now();
    projectCounter += 1;
    let projectId = "APEX-" # projectCounter.toText();
    let submission : ProjectSubmission = {
      projectId;
      package_;
      clientName;
      email;
      businessName;
      currentWebsite;
      businessType;
      whatTheyNeed;
      projectDescription;
      numberOfPages;
      needsContactForm;
      needsBooking;
      needsPaymentIntegration;
      needsDashboard;
      needsContentWriting;
      needsBranding;
      inspirationLinks;
      timeline;
      contentReadiness;
      additionalNotes;
      paymentStatus = "pending";
      transactionHash = "";
      timestamp;
    };
    projects.add(projectId, submission);
    projectId;
  };

  public query func getProjects() : async [ProjectSubmission] {
    projects.values().toArray().sort(Project.compareByTimestamp);
  };

  public shared func updatePaymentStatus(projectId : Text, status : Text, txHash : Text) : async Bool {
    switch (projects.get(projectId)) {
      case null { false };
      case (?existing) {
        let updated : ProjectSubmission = {
          projectId = existing.projectId;
          package_ = existing.package_;
          clientName = existing.clientName;
          email = existing.email;
          businessName = existing.businessName;
          currentWebsite = existing.currentWebsite;
          businessType = existing.businessType;
          whatTheyNeed = existing.whatTheyNeed;
          projectDescription = existing.projectDescription;
          numberOfPages = existing.numberOfPages;
          needsContactForm = existing.needsContactForm;
          needsBooking = existing.needsBooking;
          needsPaymentIntegration = existing.needsPaymentIntegration;
          needsDashboard = existing.needsDashboard;
          needsContentWriting = existing.needsContentWriting;
          needsBranding = existing.needsBranding;
          inspirationLinks = existing.inspirationLinks;
          timeline = existing.timeline;
          contentReadiness = existing.contentReadiness;
          additionalNotes = existing.additionalNotes;
          paymentStatus = status;
          transactionHash = txHash;
          timestamp = existing.timestamp;
        };
        projects.add(projectId, updated);
        true;
      };
    };
  };
};
