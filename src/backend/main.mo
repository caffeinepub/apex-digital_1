import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";

actor {
  type Contact = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  module Contact {
    public func compareByTimestamp(contact1 : Contact, contact2 : Contact) : Order.Order {
      Int.compare(contact1.timestamp, contact2.timestamp);
    };
  };

  let contacts = Map.empty<Int, Contact>();

  public shared ({ caller }) func submitContact(name : Text, email : Text, message : Text) : async () {
    let timestamp = Time.now();
    let contact : Contact = {
      name;
      email;
      message;
      timestamp;
    };
    contacts.add(timestamp, contact);
  };

  public query ({ caller }) func getContacts() : async [Contact] {
    contacts.values().toArray().sort(Contact.compareByTimestamp);
  };
};
