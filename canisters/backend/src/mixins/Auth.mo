/// Admin login, logout and password change.
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";

import T "../types";
import Auth "../lib/Auth";

mixin (
  auth : Auth.State,
  config : T.Config,
) {



  // ─── Auth API ─────────────────────────────────────────────────────────────

  public func adminLogin(passwordHash : Text) : async ?Text {
    if (passwordHash == config.adminPasswordHash) {
      let token = Auth.generateToken(auth, Time.now());
      let expiry = Time.now() + 86_400_000_000_000; // 24 hours
      Map.add(auth.sessions, Text.compare, token, expiry);
      ?token
    } else {
      null
    }
  };

  public func adminLogout(token : Text) : async () {
    ignore Map.delete(auth.sessions, Text.compare, token);
  };

  public query func checkSession(token : Text) : async Bool {
    Auth.isValidSession(auth, token)
  };

  public func changePassword(token : Text, newPasswordHash : Text) : async Bool {
    Auth.requireAuth(auth, token);
    config.adminPasswordHash := newPasswordHash;
    true
  };

};
