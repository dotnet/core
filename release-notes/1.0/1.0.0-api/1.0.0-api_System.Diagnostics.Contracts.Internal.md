# System.Diagnostics.Contracts.Internal

``` diff
+namespace System.Diagnostics.Contracts.Internal {
+    public static class ContractHelper {
+        public static string RaiseContractFailedEvent(ContractFailureKind failureKind, string userMessage, string conditionText, Exception innerException);
+        public static void TriggerFailure(ContractFailureKind kind, string displayMessage, string userMessage, string conditionText, Exception innerException);
+    }
+}
```

