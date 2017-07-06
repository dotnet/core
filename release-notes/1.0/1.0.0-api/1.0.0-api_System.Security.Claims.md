# System.Security.Claims

``` diff
+namespace System.Security.Claims {
+    public class Claim {
+        public Claim(BinaryReader reader);
+        public Claim(BinaryReader reader, ClaimsIdentity subject);
+        protected Claim(Claim other);
+        protected Claim(Claim other, ClaimsIdentity subject);
+        public Claim(string type, string value);
+        public Claim(string type, string value, string valueType);
+        public Claim(string type, string value, string valueType, string issuer);
+        public Claim(string type, string value, string valueType, string issuer, string originalIssuer);
+        public Claim(string type, string value, string valueType, string issuer, string originalIssuer, ClaimsIdentity subject);
+        protected virtual byte[] CustomSerializationData { get; }
+        public string Issuer { get; }
+        public string OriginalIssuer { get; }
+        public IDictionary<string, string> Properties { get; }
+        public ClaimsIdentity Subject { get; }
+        public string Type { get; }
+        public string Value { get; }
+        public string ValueType { get; }
+        public virtual Claim Clone();
+        public virtual Claim Clone(ClaimsIdentity identity);
+        public override string ToString();
+        public virtual void WriteTo(BinaryWriter writer);
+        protected virtual void WriteTo(BinaryWriter writer, byte[] userData);
+    }
+    public class ClaimsIdentity : IIdentity {
+        public const string DefaultIssuer = "LOCAL AUTHORITY";
+        public const string DefaultNameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
+        public const string DefaultRoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
+        public ClaimsIdentity();
+        public ClaimsIdentity(IEnumerable<Claim> claims);
+        public ClaimsIdentity(IEnumerable<Claim> claims, string authenticationType);
+        public ClaimsIdentity(IEnumerable<Claim> claims, string authenticationType, string nameType, string roleType);
+        public ClaimsIdentity(BinaryReader reader);
+        protected ClaimsIdentity(ClaimsIdentity other);
+        public ClaimsIdentity(IIdentity identity);
+        public ClaimsIdentity(IIdentity identity, IEnumerable<Claim> claims);
+        public ClaimsIdentity(IIdentity identity, IEnumerable<Claim> claims, string authenticationType, string nameType, string roleType);
+        public ClaimsIdentity(string authenticationType);
+        public ClaimsIdentity(string authenticationType, string nameType, string roleType);
+        public ClaimsIdentity Actor { get; set; }
+        public virtual string AuthenticationType { get; }
+        public object BootstrapContext { get; set; }
+        public virtual IEnumerable<Claim> Claims { get; }
+        protected virtual byte[] CustomSerializationData { get; }
+        public virtual bool IsAuthenticated { get; }
+        public string Label { get; set; }
+        public virtual string Name { get; }
+        public string NameClaimType { get; }
+        public string RoleClaimType { get; }
+        public virtual void AddClaim(Claim claim);
+        public virtual void AddClaims(IEnumerable<Claim> claims);
+        public virtual ClaimsIdentity Clone();
+        protected virtual Claim CreateClaim(BinaryReader reader);
+        public virtual IEnumerable<Claim> FindAll(Predicate<Claim> match);
+        public virtual IEnumerable<Claim> FindAll(string type);
+        public virtual Claim FindFirst(Predicate<Claim> match);
+        public virtual Claim FindFirst(string type);
+        public virtual bool HasClaim(Predicate<Claim> match);
+        public virtual bool HasClaim(string type, string value);
+        public virtual void RemoveClaim(Claim claim);
+        public virtual bool TryRemoveClaim(Claim claim);
+        public virtual void WriteTo(BinaryWriter writer);
+        protected virtual void WriteTo(BinaryWriter writer, byte[] userData);
+    }
+    public class ClaimsPrincipal : IPrincipal {
+        public ClaimsPrincipal();
+        public ClaimsPrincipal(IEnumerable<ClaimsIdentity> identities);
+        public ClaimsPrincipal(BinaryReader reader);
+        public ClaimsPrincipal(IIdentity identity);
+        public ClaimsPrincipal(IPrincipal principal);
+        public virtual IEnumerable<Claim> Claims { get; }
+        public static Func<ClaimsPrincipal> ClaimsPrincipalSelector { get; set; }
+        public static ClaimsPrincipal Current { get; }
+        protected virtual byte[] CustomSerializationData { get; }
+        public virtual IEnumerable<ClaimsIdentity> Identities { get; }
+        public virtual IIdentity Identity { get; }
+        public static Func<IEnumerable<ClaimsIdentity>, ClaimsIdentity> PrimaryIdentitySelector { get; set; }
+        public virtual void AddIdentities(IEnumerable<ClaimsIdentity> identities);
+        public virtual void AddIdentity(ClaimsIdentity identity);
+        public virtual ClaimsPrincipal Clone();
+        protected virtual ClaimsIdentity CreateClaimsIdentity(BinaryReader reader);
+        public virtual IEnumerable<Claim> FindAll(Predicate<Claim> match);
+        public virtual IEnumerable<Claim> FindAll(string type);
+        public virtual Claim FindFirst(Predicate<Claim> match);
+        public virtual Claim FindFirst(string type);
+        public virtual bool HasClaim(Predicate<Claim> match);
+        public virtual bool HasClaim(string type, string value);
+        public virtual bool IsInRole(string role);
+        public virtual void WriteTo(BinaryWriter writer);
+        protected virtual void WriteTo(BinaryWriter writer, byte[] userData);
+    }
+    public static class ClaimTypes {
+        public const string Actor = "http://schemas.xmlsoap.org/ws/2009/09/identity/claims/actor";
+        public const string Anonymous = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/anonymous";
+        public const string Authentication = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication";
+        public const string AuthenticationInstant = "http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant";
+        public const string AuthenticationMethod = "http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod";
+        public const string AuthorizationDecision = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision";
+        public const string CookiePath = "http://schemas.microsoft.com/ws/2008/06/identity/claims/cookiepath";
+        public const string Country = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country";
+        public const string DateOfBirth = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth";
+        public const string DenyOnlyPrimaryGroupSid = "http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarygroupsid";
+        public const string DenyOnlyPrimarySid = "http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarysid";
+        public const string DenyOnlySid = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/denyonlysid";
+        public const string DenyOnlyWindowsDeviceGroup = "http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlywindowsdevicegroup";
+        public const string Dns = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dns";
+        public const string Dsa = "http://schemas.microsoft.com/ws/2008/06/identity/claims/dsa";
+        public const string Email = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
+        public const string Expiration = "http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration";
+        public const string Expired = "http://schemas.microsoft.com/ws/2008/06/identity/claims/expired";
+        public const string Gender = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/gender";
+        public const string GivenName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
+        public const string GroupSid = "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid";
+        public const string Hash = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/hash";
+        public const string HomePhone = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/homephone";
+        public const string IsPersistent = "http://schemas.microsoft.com/ws/2008/06/identity/claims/ispersistent";
+        public const string Locality = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/locality";
+        public const string MobilePhone = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone";
+        public const string Name = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
+        public const string NameIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
+        public const string OtherPhone = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/otherphone";
+        public const string PostalCode = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/postalcode";
+        public const string PrimaryGroupSid = "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarygroupsid";
+        public const string PrimarySid = "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid";
+        public const string Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
+        public const string Rsa = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/rsa";
+        public const string SerialNumber = "http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber";
+        public const string Sid = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid";
+        public const string Spn = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn";
+        public const string StateOrProvince = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/stateorprovince";
+        public const string StreetAddress = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/streetaddress";
+        public const string Surname = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
+        public const string System = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/system";
+        public const string Thumbprint = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/thumbprint";
+        public const string Upn = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn";
+        public const string Uri = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri";
+        public const string UserData = "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata";
+        public const string Version = "http://schemas.microsoft.com/ws/2008/06/identity/claims/version";
+        public const string Webpage = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/webpage";
+        public const string WindowsAccountName = "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname";
+        public const string WindowsDeviceClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdeviceclaim";
+        public const string WindowsDeviceGroup = "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdevicegroup";
+        public const string WindowsFqbnVersion = "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsfqbnversion";
+        public const string WindowsSubAuthority = "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowssubauthority";
+        public const string WindowsUserClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsuserclaim";
+        public const string X500DistinguishedName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname";
+    }
+    public static class ClaimValueTypes {
+        public const string Base64Binary = "http://www.w3.org/2001/XMLSchema#base64Binary";
+        public const string Base64Octet = "http://www.w3.org/2001/XMLSchema#base64Octet";
+        public const string Boolean = "http://www.w3.org/2001/XMLSchema#boolean";
+        public const string Date = "http://www.w3.org/2001/XMLSchema#date";
+        public const string DateTime = "http://www.w3.org/2001/XMLSchema#dateTime";
+        public const string DaytimeDuration = "http://www.w3.org/TR/2002/WD-xquery-operators-20020816#dayTimeDuration";
+        public const string DnsName = "http://schemas.xmlsoap.org/claims/dns";
+        public const string Double = "http://www.w3.org/2001/XMLSchema#double";
+        public const string DsaKeyValue = "http://www.w3.org/2000/09/xmldsig#DSAKeyValue";
+        public const string Email = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
+        public const string Fqbn = "http://www.w3.org/2001/XMLSchema#fqbn";
+        public const string HexBinary = "http://www.w3.org/2001/XMLSchema#hexBinary";
+        public const string Integer = "http://www.w3.org/2001/XMLSchema#integer";
+        public const string Integer32 = "http://www.w3.org/2001/XMLSchema#integer32";
+        public const string Integer64 = "http://www.w3.org/2001/XMLSchema#integer64";
+        public const string KeyInfo = "http://www.w3.org/2000/09/xmldsig#KeyInfo";
+        public const string Rfc822Name = "urn:oasis:names:tc:xacml:1.0:data-type:rfc822Name";
+        public const string Rsa = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/rsa";
+        public const string RsaKeyValue = "http://www.w3.org/2000/09/xmldsig#RSAKeyValue";
+        public const string Sid = "http://www.w3.org/2001/XMLSchema#sid";
+        public const string String = "http://www.w3.org/2001/XMLSchema#string";
+        public const string Time = "http://www.w3.org/2001/XMLSchema#time";
+        public const string UInteger32 = "http://www.w3.org/2001/XMLSchema#uinteger32";
+        public const string UInteger64 = "http://www.w3.org/2001/XMLSchema#uinteger64";
+        public const string UpnName = "http://schemas.xmlsoap.org/claims/UPN";
+        public const string X500Name = "urn:oasis:names:tc:xacml:1.0:data-type:x500Name";
+        public const string YearMonthDuration = "http://www.w3.org/TR/2002/WD-xquery-operators-20020816#yearMonthDuration";
+    }
+}
```

