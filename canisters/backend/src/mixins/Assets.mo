/// Uploaded asset storage.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

import T "../types";
import Auth "../lib/Auth";
import Limits "../lib/Limits";

mixin (
  auth : Auth.State,
  counters : T.Counters,
  assets : Map.Map<Text, Blob>,
) {



  // ─── Asset Upload ─────────────────────────────────────────────────────────


  public func uploadAsset(token : Text, name : Text, contentType : Text, data : Blob) : async Text {
    Auth.requireAuth(auth, token);
    // Kept in the API for clients; assets are served without a stored content type.
    ignore contentType;
    if (data.size() > Limits.maxAssetSize) {
      Runtime.trap("Asset too large: max " # Nat.toText(Limits.maxAssetSize) # " bytes");
    };
    counters.assetCounter += 1;
    let key = "/uploads/" # Nat.toText(counters.assetCounter) # "-" # name;
    Map.add(assets, Text.compare, key, data);
    key
  };

  public query func getAsset(key : Text) : async ?Blob {
    Map.get(assets, Text.compare, key)
  };

  public query func listAssets() : async [Text] {
    Iter.toArray(
      Iter.map<(Text, Blob), Text>(
        Map.entries(assets),
        func ((k, _)) { k }
      )
    )
  };

  public func deleteAsset(token : Text, key : Text) : async Bool {
    Auth.requireAuth(auth, token);
    switch (Map.get(assets, Text.compare, key)) {
      case (?_) { ignore Map.delete(assets, Text.compare, key); true };
      case null { false };
    }
  };


};
