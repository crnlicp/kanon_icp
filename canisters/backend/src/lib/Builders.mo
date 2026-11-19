/// Build stored records from Candid input records.
import Array "mo:core/Array";

import T "../types";
import H "./Helpers";

module {

  type EventSession = T.EventSession;
  type EventSessionReturn = T.EventSessionReturn;
  type FormField = T.FormField;
  type FormFieldReturn = T.FormFieldReturn;

  public func buildSessions(raw : [EventSessionReturn]) : [EventSession] {
    Array.map<EventSessionReturn, EventSession>(raw, func (s) {
      {
        id             = s.id;
        name           = { fa = s.name_fa; sv = s.name_sv };
        date           = s.date;
        capacity       = s.capacity;
        bufferCapacity = s.bufferCapacity;
        sortOrder      = s.sortOrder;
      }
    })
  };

  public func buildFormFields(raw : [FormFieldReturn]) : [FormField] {
    Array.map<FormFieldReturn, FormField>(raw, func (f) {
      {
        id = f.id;
        fieldType = H.textToFieldType(f.fieldType);
        fieldLabel = { fa = f.label_fa; sv = f.label_sv };
        placeholder = { fa = f.placeholder_fa; sv = f.placeholder_sv };
        required = f.required;
        options = Array.map<{ fa : Text; sv : Text }, T.LocalizedText>(
          f.options, func (o) { { fa = o.fa; sv = o.sv } }
        );
        sortOrder = f.sortOrder;
        isLookupField = f.isLookupField;
        minValue = f.minValue;
        maxValue = f.maxValue;
        perMember = ?f.perMember;
        excludeFromCapacityWhenChecked = ?f.excludeFromCapacityWhenChecked;
        unique = ?f.unique;
        allowedValues = ?f.allowedValues;
      }
    })
  };

};
