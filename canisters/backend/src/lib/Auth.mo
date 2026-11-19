/// Admin session handling. State is transient: an upgrade logs everyone out.
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

module {

  public type State = {
    // token → expiry timestamp (nanoseconds)
    sessions : Map.Map<Text, Int>;
    var counter : Nat;
  };

  public func empty() : State {
    { sessions = Map.empty(); var counter = 0 };
  };

  public func generateToken(state : State, time : Int) : Text {
    state.counter += 1;
    "sk-" # time.toText() # "-" # state.counter.toText()
  };

  public func isValidSession(state : State, token : Text) : Bool {
    switch (state.sessions.get(token)) {
      case (?expiry) { Time.now() < expiry };
      case null { false };
    }
  };

  public func requireAuth(state : State, token : Text) {
    if (not isValidSession(state, token)) {
      Runtime.trap("Unauthorized: invalid or expired session");
    };
  };

};
