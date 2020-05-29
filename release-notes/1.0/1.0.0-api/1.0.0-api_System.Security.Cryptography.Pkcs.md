# System.Security.Cryptography.Pkcs

``` diff
+namespace System.Security.Cryptography.Pkcs {
+    public sealed class AlgorithmIdentifier {
+        public AlgorithmIdentifier();
+        public AlgorithmIdentifier(Oid oid);
+        public AlgorithmIdentifier(Oid oid, int keyLength);
+        public int KeyLength { get; set; }
+        public Oid Oid { get; set; }
+    }
+    public sealed class CmsRecipient {
+        public CmsRecipient(SubjectIdentifierType recipientIdentifierType, X509Certificate2 certificate);
+        public CmsRecipient(X509Certificate2 certificate);
+        public X509Certificate2 Certificate { get; }
+        public SubjectIdentifierType RecipientIdentifierType { get; }
+    }
+    public sealed class CmsRecipientCollection : ICollection, IEnumerable {
+        public CmsRecipientCollection();
+        public CmsRecipientCollection(CmsRecipient recipient);
+        public CmsRecipientCollection(SubjectIdentifierType recipientIdentifierType, X509Certificate2Collection certificates);
+        public int Count { get; }
+        bool System.Collections.ICollection.IsSynchronized { get; }
+        object System.Collections.ICollection.SyncRoot { get; }
+        public CmsRecipient this[int index] { get; }
+        public int Add(CmsRecipient recipient);
+        public void CopyTo(Array array, int index);
+        public void CopyTo(CmsRecipient[] array, int index);
+        public CmsRecipientEnumerator GetEnumerator();
+        public void Remove(CmsRecipient recipient);
+        IEnumerator System.Collections.IEnumerable.GetEnumerator();
+    }
+    public sealed class CmsRecipientEnumerator : IEnumerator {
+        public CmsRecipient Current { get; }
+        object System.Collections.IEnumerator.Current { get; }
+        public bool MoveNext();
+        public void Reset();
+    }
+    public sealed class ContentInfo {
+        public ContentInfo(byte[] content);
+        public ContentInfo(Oid contentType, byte[] content);
+        public byte[] Content { get; }
+        public Oid ContentType { get; }
+        public static Oid GetContentType(byte[] encodedMessage);
+    }
+    public sealed class EnvelopedCms {
+        public EnvelopedCms();
+        public EnvelopedCms(ContentInfo contentInfo);
+        public EnvelopedCms(ContentInfo contentInfo, AlgorithmIdentifier encryptionAlgorithm);
+        public X509Certificate2Collection Certificates { get; }
+        public AlgorithmIdentifier ContentEncryptionAlgorithm { get; }
+        public ContentInfo ContentInfo { get; }
+        public RecipientInfoCollection RecipientInfos { get; }
+        public CryptographicAttributeObjectCollection UnprotectedAttributes { get; }
+        public int Version { get; }
+        public void Decode(byte[] encodedMessage);
+        public void Decrypt();
+        public void Decrypt(RecipientInfo recipientInfo);
+        public void Decrypt(RecipientInfo recipientInfo, X509Certificate2Collection extraStore);
+        public void Decrypt(X509Certificate2Collection extraStore);
+        public byte[] Encode();
+        public void Encrypt(CmsRecipient recipient);
+        public void Encrypt(CmsRecipientCollection recipients);
+    }
+    public sealed class KeyAgreeRecipientInfo : RecipientInfo {
+        public DateTime Date { get; }
+        public override byte[] EncryptedKey { get; }
+        public override AlgorithmIdentifier KeyEncryptionAlgorithm { get; }
+        public SubjectIdentifierOrKey OriginatorIdentifierOrKey { get; }
+        public CryptographicAttributeObject OtherKeyAttribute { get; }
+        public override SubjectIdentifier RecipientIdentifier { get; }
+        public override int Version { get; }
+    }
+    public sealed class KeyTransRecipientInfo : RecipientInfo {
+        public override byte[] EncryptedKey { get; }
+        public override AlgorithmIdentifier KeyEncryptionAlgorithm { get; }
+        public override SubjectIdentifier RecipientIdentifier { get; }
+        public override int Version { get; }
+    }
+    public class Pkcs9AttributeObject : AsnEncodedData {
+        public Pkcs9AttributeObject();
+        public Pkcs9AttributeObject(AsnEncodedData asnEncodedData);
+        public Pkcs9AttributeObject(Oid oid, byte[] encodedData);
+        public Pkcs9AttributeObject(string oid, byte[] encodedData);
+        public new Oid Oid { get; }
+        public override void CopyFrom(AsnEncodedData asnEncodedData);
+    }
+    public sealed class Pkcs9ContentType : Pkcs9AttributeObject {
+        public Pkcs9ContentType();
+        public Oid ContentType { get; }
+        public override void CopyFrom(AsnEncodedData asnEncodedData);
+    }
+    public sealed class Pkcs9DocumentDescription : Pkcs9AttributeObject {
+        public Pkcs9DocumentDescription();
+        public Pkcs9DocumentDescription(byte[] encodedDocumentDescription);
+        public Pkcs9DocumentDescription(string documentDescription);
+        public string DocumentDescription { get; }
+        public override void CopyFrom(AsnEncodedData asnEncodedData);
+    }
+    public sealed class Pkcs9DocumentName : Pkcs9AttributeObject {
+        public Pkcs9DocumentName();
+        public Pkcs9DocumentName(byte[] encodedDocumentName);
+        public Pkcs9DocumentName(string documentName);
+        public string DocumentName { get; }
+        public override void CopyFrom(AsnEncodedData asnEncodedData);
+    }
+    public sealed class Pkcs9MessageDigest : Pkcs9AttributeObject {
+        public Pkcs9MessageDigest();
+        public byte[] MessageDigest { get; }
+        public override void CopyFrom(AsnEncodedData asnEncodedData);
+    }
+    public sealed class Pkcs9SigningTime : Pkcs9AttributeObject {
+        public Pkcs9SigningTime();
+        public Pkcs9SigningTime(byte[] encodedSigningTime);
+        public Pkcs9SigningTime(DateTime signingTime);
+        public DateTime SigningTime { get; }
+        public override void CopyFrom(AsnEncodedData asnEncodedData);
+    }
+    public sealed class PublicKeyInfo {
+        public AlgorithmIdentifier Algorithm { get; }
+        public byte[] KeyValue { get; }
+    }
+    public abstract class RecipientInfo {
+        public abstract byte[] EncryptedKey { get; }
+        public abstract AlgorithmIdentifier KeyEncryptionAlgorithm { get; }
+        public abstract SubjectIdentifier RecipientIdentifier { get; }
+        public RecipientInfoType Type { get; }
+        public abstract int Version { get; }
+    }
+    public sealed class RecipientInfoCollection : ICollection, IEnumerable {
+        public int Count { get; }
+        bool System.Collections.ICollection.IsSynchronized { get; }
+        object System.Collections.ICollection.SyncRoot { get; }
+        public RecipientInfo this[int index] { get; }
+        public void CopyTo(Array array, int index);
+        public void CopyTo(RecipientInfo[] array, int index);
+        public RecipientInfoEnumerator GetEnumerator();
+        IEnumerator System.Collections.IEnumerable.GetEnumerator();
+    }
+    public sealed class RecipientInfoEnumerator : IEnumerator {
+        public RecipientInfo Current { get; }
+        object System.Collections.IEnumerator.Current { get; }
+        public bool MoveNext();
+        public void Reset();
+    }
+    public enum RecipientInfoType {
+        KeyAgreement = 2,
+        KeyTransport = 1,
+        Unknown = 0,
+    }
+    public sealed class SubjectIdentifier {
+        public SubjectIdentifierType Type { get; }
+        public object Value { get; }
+    }
+    public sealed class SubjectIdentifierOrKey {
+        public SubjectIdentifierOrKeyType Type { get; }
+        public object Value { get; }
+    }
+    public enum SubjectIdentifierOrKeyType {
+        IssuerAndSerialNumber = 1,
+        PublicKeyInfo = 3,
+        SubjectKeyIdentifier = 2,
+        Unknown = 0,
+    }
+    public enum SubjectIdentifierType {
+        IssuerAndSerialNumber = 1,
+        NoSignature = 3,
+        SubjectKeyIdentifier = 2,
+        Unknown = 0,
+    }
+}
```

