# System.Diagnostics.Contracts

``` diff
+namespace System.Diagnostics.Contracts {
+    public static class Contract {
+        public static event EventHandler<ContractFailedEventArgs> ContractFailed;
+        public static void Assert(bool condition);
+        public static void Assert(bool condition, string userMessage);
+        public static void Assume(bool condition);
+        public static void Assume(bool condition, string userMessage);
+        public static void EndContractBlock();
+        public static void Ensures(bool condition);
+        public static void Ensures(bool condition, string userMessage);
+        public static void EnsuresOnThrow<TException>(bool condition) where TException : Exception;
+        public static void EnsuresOnThrow<TException>(bool condition, string userMessage) where TException : Exception;
+        public static bool Exists(int fromInclusive, int toExclusive, Predicate<int> predicate);
+        public static bool Exists<T>(IEnumerable<T> collection, Predicate<T> predicate);
+        public static bool ForAll(int fromInclusive, int toExclusive, Predicate<int> predicate);
+        public static bool ForAll<T>(IEnumerable<T> collection, Predicate<T> predicate);
+        public static void Invariant(bool condition);
+        public static void Invariant(bool condition, string userMessage);
+        public static T OldValue<T>(T value);
+        public static void Requires(bool condition);
+        public static void Requires(bool condition, string userMessage);
+        public static void Requires<TException>(bool condition) where TException : Exception;
+        public static void Requires<TException>(bool condition, string userMessage) where TException : Exception;
+        public static T Result<T>();
+        public static T ValueAtReturn<T>(out T value);
+    }
+    public sealed class ContractAbbreviatorAttribute : Attribute {
+        public ContractAbbreviatorAttribute();
+    }
+    public sealed class ContractArgumentValidatorAttribute : Attribute {
+        public ContractArgumentValidatorAttribute();
+    }
+    public sealed class ContractClassAttribute : Attribute {
+        public ContractClassAttribute(Type typeContainingContracts);
+        public Type TypeContainingContracts { get; }
+    }
+    public sealed class ContractClassForAttribute : Attribute {
+        public ContractClassForAttribute(Type typeContractsAreFor);
+        public Type TypeContractsAreFor { get; }
+    }
+    public sealed class ContractFailedEventArgs : EventArgs {
+        public ContractFailedEventArgs(ContractFailureKind failureKind, string message, string condition, Exception originalException);
+        public string Condition { get; }
+        public ContractFailureKind FailureKind { get; }
+        public bool Handled { get; }
+        public string Message { get; }
+        public Exception OriginalException { get; }
+        public bool Unwind { get; }
+        public void SetHandled();
+        public void SetUnwind();
+    }
+    public enum ContractFailureKind {
+        Assert = 4,
+        Assume = 5,
+        Invariant = 3,
+        Postcondition = 1,
+        PostconditionOnException = 2,
+        Precondition = 0,
+    }
+    public sealed class ContractInvariantMethodAttribute : Attribute {
+        public ContractInvariantMethodAttribute();
+    }
+    public sealed class ContractOptionAttribute : Attribute {
+        public ContractOptionAttribute(string category, string setting, bool enabled);
+        public ContractOptionAttribute(string category, string setting, string value);
+        public string Category { get; }
+        public bool Enabled { get; }
+        public string Setting { get; }
+        public string Value { get; }
+    }
+    public sealed class ContractPublicPropertyNameAttribute : Attribute {
+        public ContractPublicPropertyNameAttribute(string name);
+        public string Name { get; }
+    }
+    public sealed class ContractReferenceAssemblyAttribute : Attribute {
+        public ContractReferenceAssemblyAttribute();
+    }
+    public sealed class ContractRuntimeIgnoredAttribute : Attribute {
+        public ContractRuntimeIgnoredAttribute();
+    }
+    public sealed class ContractVerificationAttribute : Attribute {
+        public ContractVerificationAttribute(bool value);
+        public bool Value { get; }
+    }
+    public sealed class PureAttribute : Attribute {
+        public PureAttribute();
+    }
+}
```

