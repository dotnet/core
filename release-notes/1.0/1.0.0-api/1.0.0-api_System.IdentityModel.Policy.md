# System.IdentityModel.Policy

``` diff
+namespace System.IdentityModel.Policy {
+    public abstract class AuthorizationContext : IAuthorizationComponent {
+        protected AuthorizationContext();
+        public abstract ReadOnlyCollection<ClaimSet> ClaimSets { get; }
+        public abstract DateTime ExpirationTime { get; }
+        public abstract string Id { get; }
+        public abstract IDictionary<string, object> Properties { get; }
+        public static AuthorizationContext CreateDefaultAuthorizationContext(IList<IAuthorizationPolicy> authorizationPolicies);
+    }
+    public abstract class EvaluationContext {
+        protected EvaluationContext();
+        public abstract ReadOnlyCollection<ClaimSet> ClaimSets { get; }
+        public abstract int Generation { get; }
+        public abstract IDictionary<string, object> Properties { get; }
+        public abstract void AddClaimSet(IAuthorizationPolicy policy, ClaimSet claimSet);
+        public abstract void RecordExpirationTime(DateTime expirationTime);
+    }
+    public interface IAuthorizationComponent {
+        string Id { get; }
+    }
+    public interface IAuthorizationPolicy : IAuthorizationComponent {
+        ClaimSet Issuer { get; }
+        bool Evaluate(EvaluationContext evaluationContext, ref object state);
+    }
+}
```

