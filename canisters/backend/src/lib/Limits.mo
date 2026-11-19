/// Input size limits for public endpoints.
module {
  public let maxNameLen : Nat = 200;
  public let maxEmailLen : Nat = 200;
  public let maxPhoneLen : Nat = 50;
  public let maxMessageLen : Nat = 2000;
  public let maxFieldValueLen : Nat = 2000;
  public let maxFieldValues : Nat = 50;
  public let maxPersonCount : Nat = 20;
  public let maxSessions : Nat = 20;
  public let maxAssetSize : Nat = 1_500_000;
};
