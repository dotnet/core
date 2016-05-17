# API Diff between RC1 and RC2

- [System](#system)
- [System.ComponentModel.DataAnnotations](#systemcomponentmodeldataannotations)
- [System.Data](#systemdata)
- [System.Data.Common](#systemdatacommon)
- [System.Data.SqlClient](#systemdatasqlclient)
- [System.Diagnostics](#systemdiagnostics)
- [System.Drawing](#systemdrawing)
- [System.IO](#systemio)
- [System.IO.Packaging](#systemiopackaging)
- [System.Linq](#systemlinq)
- [System.Net](#systemnet)
- [System.Net.NetworkInformation](#systemnetnetworkinformation)
- [System.Net.Security](#systemnetsecurity)
- [System.Net.Sockets](#systemnetsockets)
- [System.Reflection](#systemreflection)
- [System.Runtime.InteropServices](#systemruntimeinteropservices)
- [System.Runtime.Loader](#systemruntimeloader)
- [System.Runtime.Serialization](#systemruntimeserialization)
- [System.Security.Cryptography](#systemsecuritycryptography)
- [System.Security.Cryptography.X509Certificates](#systemsecuritycryptographyx509certificates)
- [System.Security.Principal](#systemsecurityprincipal)
- [System.ServiceModel](#systemservicemodel)
- [System.ServiceModel.Channels](#systemservicemodelchannels)

## System

```csharp
namespace System {
  public static class Activator {
    public static object CreateInstance(Type type, bool nonPublic);
  }
  public static class AppContext {
    public static string TargetFrameworkName { get; }
    public static object GetData(string name);
  }
  public static class Console {
    public static int BufferHeight { get; set; }
    public static int BufferWidth { get; set; }
    public static bool CapsLock { get; }
    public static int CursorLeft { get; set; }
    public static int CursorSize { get; set; }
    public static int CursorTop { get; set; }
    public static Encoding InputEncoding { get; set; }
    public static bool KeyAvailable { get; }
    public static int LargestWindowHeight { get; }
    public static int LargestWindowWidth { get; }
    public static bool NumberLock { get; }
    public static Encoding OutputEncoding { get; set; }
    public static string Title { get; set; }
    public static bool TreatControlCAsInput { get; set; }
    public static int WindowHeight { get; set; }
    public static int WindowLeft { get; set; }
    public static int WindowTop { get; set; }
    public static void Beep();
    public static void Beep(int frequency, int duration);
    public static void Clear();
    public static void MoveBufferArea(int sourceLeft, int sourceTop, int sourceWidth, int sourceHeight, int targetLeft, int targetTop);
    public static void MoveBufferArea(int sourceLeft, int sourceTop, int sourceWidth, int sourceHeight, int targetLeft, int targetTop, char sourceChar, ConsoleColor sourceForeColor, ConsoleColor sourceBackColor);
    public static void SetBufferSize(int width, int height);
    public static void SetCursorPosition(int left, int top);
    public static void SetWindowPosition(int left, int top);
    public static void SetWindowSize(int width, int height);
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
  public struct ConsoleKeyInfo {
    public bool Equals(ConsoleKeyInfo obj);
    public override bool Equals(object value);
    public override int GetHashCode();
    public static bool operator ==(ConsoleKeyInfo a, ConsoleKeyInfo b);
    public static bool operator !=(ConsoleKeyInfo a, ConsoleKeyInfo b);
  }
  public static class Environment {
    public static string MachineName { get; }
    public static void Exit(int exitCode);
    public static string[] GetCommandLineArgs();
  }
  public abstract class Type {
    public static readonly char Delimiter;
    public static TypeCode GetTypeCode(Type type);
  }
}
```

## System.ComponentModel.DataAnnotations

```csharp
namespace System.ComponentModel.DataAnnotations {
  public class RegularExpressionAttribute : ValidationAttribute {
    public int MatchTimeoutInMilliseconds { get; set; }
  }
}
```

## System.Data

```csharp
namespace System.Data {
  public enum DataRowVersion {
    Default = 1536,
  }
  public class DataTable {
  }
  public interface IDataParameter {
    DbType DbType { get; set; }
    ParameterDirection Direction { get; set; }
    bool IsNullable { get; }
    string ParameterName { get; set; }
    string SourceColumn { get; set; }
    DataRowVersion SourceVersion { get; set; }
    object Value { get; set; }
  }
  public interface IDataParameterCollection : ICollection, IEnumerable, IList {
    object this[string parameterName] { get; set; }
    bool Contains(string parameterName);
    int IndexOf(string parameterName);
    void RemoveAt(string parameterName);
  }
  public interface IDataReader : IDataRecord, IDisposable {
    int Depth { get; }
    bool IsClosed { get; }
    int RecordsAffected { get; }
    void Close();
    DataTable GetSchemaTable();
    bool NextResult();
    bool Read();
  }
  public interface IDataRecord {
    int FieldCount { get; }
    object this[int i] { get; }
    object this[string name] { get; }
    bool GetBoolean(int i);
    byte GetByte(int i);
    long GetBytes(int i, long fieldOffset, byte[] buffer, int bufferoffset, int length);
    char GetChar(int i);
    long GetChars(int i, long fieldoffset, char[] buffer, int bufferoffset, int length);
    IDataReader GetData(int i);
    string GetDataTypeName(int i);
    DateTime GetDateTime(int i);
    decimal GetDecimal(int i);
    double GetDouble(int i);
    Type GetFieldType(int i);
    float GetFloat(int i);
    Guid GetGuid(int i);
    short GetInt16(int i);
    int GetInt32(int i);
    long GetInt64(int i);
    string GetName(int i);
    int GetOrdinal(string name);
    string GetString(int i);
    object GetValue(int i);
    int GetValues(object[] values);
    bool IsDBNull(int i);
  }
  public interface IDbCommand : IDisposable {
    string CommandText { get; set; }
    int CommandTimeout { get; set; }
    CommandType CommandType { get; set; }
    IDbConnection Connection { get; set; }
    IDataParameterCollection Parameters { get; }
    IDbTransaction Transaction { get; set; }
    UpdateRowSource UpdatedRowSource { get; set; }
    void Cancel();
    IDbDataParameter CreateParameter();
    int ExecuteNonQuery();
    IDataReader ExecuteReader();
    IDataReader ExecuteReader(CommandBehavior behavior);
    object ExecuteScalar();
    void Prepare();
  }
  public interface IDbConnection : IDisposable {
    string ConnectionString { get; set; }
    int ConnectionTimeout { get; }
    string Database { get; }
    ConnectionState State { get; }
    IDbTransaction BeginTransaction();
    IDbTransaction BeginTransaction(IsolationLevel il);
    void ChangeDatabase(string databaseName);
    void Close();
    IDbCommand CreateCommand();
    void Open();
  }
  public interface IDbDataParameter : IDataParameter {
    byte Precision { get; set; }
    byte Scale { get; set; }
    int Size { get; set; }
  }
  public interface IDbTransaction : IDisposable {
    IDbConnection Connection { get; }
    IsolationLevel IsolationLevel { get; }
    void Commit();
    void Rollback();
  }
}
```

## System.Data.Common

```csharp
namespace System.Data.Common {
  public abstract class DbColumn {
    protected DbColumn();
    public Nullable<bool> AllowDBNull { get; protected set; }
    public string BaseCatalogName { get; protected set; }
    public string BaseColumnName { get; protected set; }
    public string BaseSchemaName { get; protected set; }
    public string BaseServerName { get; protected set; }
    public string BaseTableName { get; protected set; }
    public string ColumnName { get; protected set; }
    public Nullable<int> ColumnOrdinal { get; protected set; }
    public Nullable<int> ColumnSize { get; protected set; }
    public Type DataType { get; protected set; }
    public string DataTypeName { get; protected set; }
    public Nullable<bool> IsAliased { get; protected set; }
    public Nullable<bool> IsAutoIncrement { get; protected set; }
    public Nullable<bool> IsExpression { get; protected set; }
    public Nullable<bool> IsHidden { get; protected set; }
    public Nullable<bool> IsIdentity { get; protected set; }
    public Nullable<bool> IsKey { get; protected set; }
    public Nullable<bool> IsLong { get; protected set; }
    public Nullable<bool> IsReadOnly { get; protected set; }
    public Nullable<bool> IsUnique { get; protected set; }
    public Nullable<int> NumericPrecision { get; protected set; }
    public Nullable<int> NumericScale { get; protected set; }
    public virtual object this[string property] { get; }
    public string UdtAssemblyQualifiedName { get; protected set; }
  }
  public abstract class DbCommand : IDbCommand, IDisposable {
    IDbConnection System.Data.IDbCommand.Connection { get; set; }
    IDataParameterCollection System.Data.IDbCommand.Parameters { get; }
    IDbTransaction System.Data.IDbCommand.Transaction { get; set; }
    IDbDataParameter System.Data.IDbCommand.CreateParameter();
    IDataReader System.Data.IDbCommand.ExecuteReader();
    IDataReader System.Data.IDbCommand.ExecuteReader(CommandBehavior behavior);
  }
  public abstract class DbConnection : IDbConnection, IDisposable {
    IDbTransaction System.Data.IDbConnection.BeginTransaction();
    IDbTransaction System.Data.IDbConnection.BeginTransaction(IsolationLevel isolationLevel);
    IDbCommand System.Data.IDbConnection.CreateCommand();
  }
  public abstract class DbDataReader : IDataReader, IDataRecord, IDisposable, IEnumerable {
    void System.Data.IDataReader.Close();
    DataTable System.Data.IDataReader.GetSchemaTable();
    IDataReader System.Data.IDataRecord.GetData(int ordinal);
  }
  public static class DbDataReaderExtensions {
    public static bool CanGetColumnSchema(this DbDataReader reader);
    public static ReadOnlyCollection<DbColumn> GetColumnSchema(this DbDataReader reader);
  }
  public abstract class DbDataRecord : IDataRecord {
    protected DbDataRecord();
    public abstract int FieldCount { get; }
    public abstract object this[int i] { get; }
    public abstract object this[string name] { get; }
    public abstract bool GetBoolean(int i);
    public abstract byte GetByte(int i);
    public abstract long GetBytes(int i, long dataIndex, byte[] buffer, int bufferIndex, int length);
    public abstract char GetChar(int i);
    public abstract long GetChars(int i, long dataIndex, char[] buffer, int bufferIndex, int length);
    public IDataReader GetData(int i);
    public abstract string GetDataTypeName(int i);
    public abstract DateTime GetDateTime(int i);
    protected virtual DbDataReader GetDbDataReader(int i);
    public abstract decimal GetDecimal(int i);
    public abstract double GetDouble(int i);
    public abstract Type GetFieldType(int i);
    public abstract float GetFloat(int i);
    public abstract Guid GetGuid(int i);
    public abstract short GetInt16(int i);
    public abstract int GetInt32(int i);
    public abstract long GetInt64(int i);
    public abstract string GetName(int i);
    public abstract int GetOrdinal(string name);
    public abstract string GetString(int i);
    public abstract object GetValue(int i);
    public abstract int GetValues(object[] values);
    public abstract bool IsDBNull(int i);
  }
  public abstract class DbParameter : IDataParameter, IDbDataParameter {
    DataRowVersion System.Data.IDataParameter.SourceVersion { get; set; }
    byte System.Data.IDbDataParameter.Precision { get; set; }
    byte System.Data.IDbDataParameter.Scale { get; set; }
  }
  public abstract class DbParameterCollection : ICollection, IDataParameterCollection, IEnumerable, IList {
    object System.Data.IDataParameterCollection.this[string parameterName] { get; set; }
  }
  public abstract class DbTransaction : IDbTransaction, IDisposable {
    IDbConnection System.Data.IDbTransaction.Connection { get; }
  }
  public interface IDbColumnSchemaGenerator {
    ReadOnlyCollection<DbColumn> GetColumnSchema();
  }
}
```

## System.Data.SqlClient

```csharp
namespace System.Data.SqlClient {
  public sealed class SqlBulkCopy : IDisposable {
    public SqlBulkCopy(SqlConnection connection);
    public SqlBulkCopy(SqlConnection connection, SqlBulkCopyOptions copyOptions, SqlTransaction externalTransaction);
    public SqlBulkCopy(string connectionString);
    public SqlBulkCopy(string connectionString, SqlBulkCopyOptions copyOptions);
    public int BatchSize { get; set; }
    public int BulkCopyTimeout { get; set; }
    public SqlBulkCopyColumnMappingCollection ColumnMappings { get; }
    public string DestinationTableName { get; set; }
    public bool EnableStreaming { get; set; }
    public int NotifyAfter { get; set; }
    public event SqlRowsCopiedEventHandler SqlRowsCopied;
    public void Close();
    void System.IDisposable.Dispose();
    public void WriteToServer(DbDataReader reader);
    public Task WriteToServerAsync(DbDataReader reader);
    public Task WriteToServerAsync(DbDataReader reader, CancellationToken cancellationToken);
  }
  public sealed class SqlBulkCopyColumnMapping {
    public SqlBulkCopyColumnMapping();
    public SqlBulkCopyColumnMapping(int sourceColumnOrdinal, int destinationOrdinal);
    public SqlBulkCopyColumnMapping(int sourceColumnOrdinal, string destinationColumn);
    public SqlBulkCopyColumnMapping(string sourceColumn, int destinationOrdinal);
    public SqlBulkCopyColumnMapping(string sourceColumn, string destinationColumn);
    public string DestinationColumn { get; set; }
    public int DestinationOrdinal { get; set; }
    public string SourceColumn { get; set; }
    public int SourceOrdinal { get; set; }
  }
  public sealed class SqlBulkCopyColumnMappingCollection : ICollection, IEnumerable, IList {
    public int Count { get; }
    bool System.Collections.ICollection.IsSynchronized { get; }
    object System.Collections.ICollection.SyncRoot { get; }
    bool System.Collections.IList.IsFixedSize { get; }
    bool System.Collections.IList.IsReadOnly { get; }
    object System.Collections.IList.this[int index] { get; set; }
    public SqlBulkCopyColumnMapping this[int index] { get; }
    public SqlBulkCopyColumnMapping Add(SqlBulkCopyColumnMapping bulkCopyColumnMapping);
    public SqlBulkCopyColumnMapping Add(int sourceColumnIndex, int destinationColumnIndex);
    public SqlBulkCopyColumnMapping Add(int sourceColumnIndex, string destinationColumn);
    public SqlBulkCopyColumnMapping Add(string sourceColumn, int destinationColumnIndex);
    public SqlBulkCopyColumnMapping Add(string sourceColumn, string destinationColumn);
    public void Clear();
    public bool Contains(SqlBulkCopyColumnMapping value);
    public void CopyTo(SqlBulkCopyColumnMapping[] array, int index);
    public IEnumerator GetEnumerator();
    public int IndexOf(SqlBulkCopyColumnMapping value);
    public void Insert(int index, SqlBulkCopyColumnMapping value);
    public void Remove(SqlBulkCopyColumnMapping value);
    public void RemoveAt(int index);
    void System.Collections.ICollection.CopyTo(Array array, int index);
    int System.Collections.IList.Add(object value);
    bool System.Collections.IList.Contains(object value);
    int System.Collections.IList.IndexOf(object value);
    void System.Collections.IList.Insert(int index, object value);
    void System.Collections.IList.Remove(object value);
  }
  public enum SqlBulkCopyOptions {
    CheckConstraints = 2,
    Default = 0,
    FireTriggers = 16,
    KeepIdentity = 1,
    KeepNulls = 8,
    TableLock = 4,
    UseInternalTransaction = 32,
  }
  public class SqlRowsCopiedEventArgs : EventArgs {
    public SqlRowsCopiedEventArgs(long rowsCopied);
    public bool Abort { get; set; }
    public long RowsCopied { get; }
  }
  public delegate void SqlRowsCopiedEventHandler(object sender, SqlRowsCopiedEventArgs e);
}
```

## System.Diagnostics

```csharp
namespace System.Diagnostics {
  public sealed class ProcessStartInfo {
    public string Domain { get; set; }
    public bool LoadUserProfile { get; set; }
    public string PasswordInClearText { get; set; }
    public string UserName { get; set; }
  }
}
```

## System.Drawing

```csharp
namespace System.Drawing {
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
  public struct Point {
    public static readonly Point Empty;
    public Point(Size sz);
    public Point(int dw);
    public Point(int x, int y);
    public bool IsEmpty { get; }
    public int X { get; set; }
    public int Y { get; set; }
    public static Point Add(Point pt, Size sz);
    public static Point Ceiling(PointF value);
    public override bool Equals(object obj);
    public override int GetHashCode();
    public void Offset(Point p);
    public void Offset(int dx, int dy);
    public static Point operator +(Point pt, Size sz);
    public static bool operator ==(Point left, Point right);
    public static explicit operator Size (Point p);
    public static implicit operator PointF (Point p);
    public static bool operator !=(Point left, Point right);
    public static Point operator -(Point pt, Size sz);
    public static Point Round(PointF value);
    public static Point Subtract(Point pt, Size sz);
    public override string ToString();
    public static Point Truncate(PointF value);
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
  public struct PointF {
    public static readonly PointF Empty;
    public PointF(float x, float y);
    public bool IsEmpty { get; }
    public float X { get; set; }
    public float Y { get; set; }
    public static PointF Add(PointF pt, Size sz);
    public static PointF Add(PointF pt, SizeF sz);
    public override bool Equals(object obj);
    public override int GetHashCode();
    public static PointF operator +(PointF pt, Size sz);
    public static PointF operator +(PointF pt, SizeF sz);
    public static bool operator ==(PointF left, PointF right);
    public static bool operator !=(PointF left, PointF right);
    public static PointF operator -(PointF pt, Size sz);
    public static PointF operator -(PointF pt, SizeF sz);
    public static PointF Subtract(PointF pt, Size sz);
    public static PointF Subtract(PointF pt, SizeF sz);
    public override string ToString();
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
  public struct Rectangle {
    public static readonly Rectangle Empty;
    public Rectangle(Point location, Size size);
    public Rectangle(int x, int y, int width, int height);
    public int Bottom { get; }
    public int Height { get; set; }
    public bool IsEmpty { get; }
    public int Left { get; }
    public Point Location { get; set; }
    public int Right { get; }
    public Size Size { get; set; }
    public int Top { get; }
    public int Width { get; set; }
    public int X { get; set; }
    public int Y { get; set; }
    public static Rectangle Ceiling(RectangleF value);
    public bool Contains(Point pt);
    public bool Contains(Rectangle rect);
    public bool Contains(int x, int y);
    public override bool Equals(object obj);
    public static Rectangle FromLTRB(int left, int top, int right, int bottom);
    public override int GetHashCode();
    public static Rectangle Inflate(Rectangle rect, int x, int y);
    public void Inflate(Size size);
    public void Inflate(int width, int height);
    public void Intersect(Rectangle rect);
    public static Rectangle Intersect(Rectangle a, Rectangle b);
    public bool IntersectsWith(Rectangle rect);
    public void Offset(Point pos);
    public void Offset(int x, int y);
    public static bool operator ==(Rectangle left, Rectangle right);
    public static bool operator !=(Rectangle left, Rectangle right);
    public static Rectangle Round(RectangleF value);
    public override string ToString();
    public static Rectangle Truncate(RectangleF value);
    public static Rectangle Union(Rectangle a, Rectangle b);
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
  public struct RectangleF {
    public static readonly RectangleF Empty;
    public RectangleF(PointF location, SizeF size);
    public RectangleF(float x, float y, float width, float height);
    public float Bottom { get; }
    public float Height { get; set; }
    public bool IsEmpty { get; }
    public float Left { get; }
    public PointF Location { get; set; }
    public float Right { get; }
    public SizeF Size { get; set; }
    public float Top { get; }
    public float Width { get; set; }
    public float X { get; set; }
    public float Y { get; set; }
    public bool Contains(PointF pt);
    public bool Contains(RectangleF rect);
    public bool Contains(float x, float y);
    public override bool Equals(object obj);
    public static RectangleF FromLTRB(float left, float top, float right, float bottom);
    public override int GetHashCode();
    public static RectangleF Inflate(RectangleF rect, float x, float y);
    public void Inflate(SizeF size);
    public void Inflate(float x, float y);
    public void Intersect(RectangleF rect);
    public static RectangleF Intersect(RectangleF a, RectangleF b);
    public bool IntersectsWith(RectangleF rect);
    public void Offset(PointF pos);
    public void Offset(float x, float y);
    public static bool operator ==(RectangleF left, RectangleF right);
    public static implicit operator RectangleF (Rectangle r);
    public static bool operator !=(RectangleF left, RectangleF right);
    public override string ToString();
    public static RectangleF Union(RectangleF a, RectangleF b);
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
  public struct Size {
    public static readonly Size Empty;
    public Size(Point pt);
    public Size(int width, int height);
    public int Height { get; set; }
    public bool IsEmpty { get; }
    public int Width { get; set; }
    public static Size Add(Size sz1, Size sz2);
    public static Size Ceiling(SizeF value);
    public override bool Equals(object obj);
    public override int GetHashCode();
    public static Size operator +(Size sz1, Size sz2);
    public static bool operator ==(Size sz1, Size sz2);
    public static explicit operator Point (Size size);
    public static implicit operator SizeF (Size p);
    public static bool operator !=(Size sz1, Size sz2);
    public static Size operator -(Size sz1, Size sz2);
    public static Size Round(SizeF value);
    public static Size Subtract(Size sz1, Size sz2);
    public override string ToString();
    public static Size Truncate(SizeF value);
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
  public struct SizeF {
    public static readonly SizeF Empty;
    public SizeF(PointF pt);
    public SizeF(SizeF size);
    public SizeF(float width, float height);
    public float Height { get; set; }
    public bool IsEmpty { get; }
    public float Width { get; set; }
    public static SizeF Add(SizeF sz1, SizeF sz2);
    public override bool Equals(object obj);
    public override int GetHashCode();
    public static SizeF operator +(SizeF sz1, SizeF sz2);
    public static bool operator ==(SizeF sz1, SizeF sz2);
    public static explicit operator PointF (SizeF size);
    public static bool operator !=(SizeF sz1, SizeF sz2);
    public static SizeF operator -(SizeF sz1, SizeF sz2);
    public static SizeF Subtract(SizeF sz1, SizeF sz2);
    public PointF ToPointF();
    public Size ToSize();
    public override string ToString();
  }
}
```

## System.IO

```csharp
namespace System.IO {
  public sealed class BufferedStream : Stream {
    public BufferedStream(Stream stream);
    public BufferedStream(Stream stream, int bufferSize);
    public override bool CanRead { get; }
    public override bool CanSeek { get; }
    public override bool CanWrite { get; }
    public override long Length { get; }
    public override long Position { get; set; }
    protected override void Dispose(bool disposing);
    public override void Flush();
    public override Task FlushAsync(CancellationToken cancellationToken);
    public override int Read(byte[] array, int offset, int count);
    public override Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken);
    public override int ReadByte();
    public override long Seek(long offset, SeekOrigin origin);
    public override void SetLength(long value);
    public override void Write(byte[] array, int offset, int count);
    public override Task WriteAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken);
    public override void WriteByte(byte value);
  }
  public class FileFormatException : FormatException {
    public FileFormatException();
    public FileFormatException(string message);
    public FileFormatException(string message, Exception innerException);
    public FileFormatException(Uri sourceUri);
    public FileFormatException(Uri sourceUri, Exception innerException);
    public FileFormatException(Uri sourceUri, string message);
    public FileFormatException(Uri sourceUri, string message, Exception innerException);
    public Uri SourceUri { get; }
  }
}
```

## System.IO.Packaging

```csharp
namespace System.IO.Packaging {
  public enum CompressionOption {
    Fast = 2,
    Maximum = 1,
    Normal = 0,
    NotCompressed = -1,
    SuperFast = 3,
  }
  public enum EncryptionOption {
    None = 0,
    RightsManagement = 1,
  }
  public abstract class Package : IDisposable {
    protected Package(FileAccess openFileAccess);
    public FileAccess FileOpenAccess { get; }
    public PackageProperties PackageProperties { get; }
    public void Close();
    public PackagePart CreatePart(Uri partUri, string contentType);
    public PackagePart CreatePart(Uri partUri, string contentType, CompressionOption compressionOption);
    protected abstract PackagePart CreatePartCore(Uri partUri, string contentType, CompressionOption compressionOption);
    public PackageRelationship CreateRelationship(Uri targetUri, TargetMode targetMode, string relationshipType);
    public PackageRelationship CreateRelationship(Uri targetUri, TargetMode targetMode, string relationshipType, string id);
    public void DeletePart(Uri partUri);
    protected abstract void DeletePartCore(Uri partUri);
    public void DeleteRelationship(string id);
    protected virtual void Dispose(bool disposing);
    public void Flush();
    protected abstract void FlushCore();
    public PackagePart GetPart(Uri partUri);
    protected abstract PackagePart GetPartCore(Uri partUri);
    public PackagePartCollection GetParts();
    protected abstract PackagePart[] GetPartsCore();
    public PackageRelationship GetRelationship(string id);
    public PackageRelationshipCollection GetRelationships();
    public PackageRelationshipCollection GetRelationshipsByType(string relationshipType);
    public static Package Open(Stream stream);
    public static Package Open(Stream stream, FileMode packageMode);
    public static Package Open(Stream stream, FileMode packageMode, FileAccess packageAccess);
    public static Package Open(string path);
    public static Package Open(string path, FileMode packageMode);
    public static Package Open(string path, FileMode packageMode, FileAccess packageAccess);
    public static Package Open(string path, FileMode packageMode, FileAccess packageAccess, FileShare packageShare);
    public virtual bool PartExists(Uri partUri);
    public bool RelationshipExists(string id);
    void System.IDisposable.Dispose();
  }
  public abstract class PackagePart {
    protected PackagePart(Package package, Uri partUri);
    protected PackagePart(Package package, Uri partUri, string contentType);
    protected PackagePart(Package package, Uri partUri, string contentType, CompressionOption compressionOption);
    public CompressionOption CompressionOption { get; }
    public string ContentType { get; }
    public Package Package { get; }
    public Uri Uri { get; }
    public PackageRelationship CreateRelationship(Uri targetUri, TargetMode targetMode, string relationshipType);
    public PackageRelationship CreateRelationship(Uri targetUri, TargetMode targetMode, string relationshipType, string id);
    public void DeleteRelationship(string id);
    protected virtual string GetContentTypeCore();
    public PackageRelationship GetRelationship(string id);
    public PackageRelationshipCollection GetRelationships();
    public PackageRelationshipCollection GetRelationshipsByType(string relationshipType);
    public Stream GetStream();
    public Stream GetStream(FileMode mode);
    public Stream GetStream(FileMode mode, FileAccess access);
    protected abstract Stream GetStreamCore(FileMode mode, FileAccess access);
    public bool RelationshipExists(string id);
  }
  public class PackagePartCollection : IEnumerable, IEnumerable<PackagePart> {
    public IEnumerator<PackagePart> GetEnumerator();
    IEnumerator<PackagePart> System.Collections.Generic.IEnumerable<System.IO.Packaging.PackagePart>.GetEnumerator();
    IEnumerator System.Collections.IEnumerable.GetEnumerator();
  }
  public abstract class PackageProperties : IDisposable {
    protected PackageProperties();
    public abstract string Category { get; set; }
    public abstract string ContentStatus { get; set; }
    public abstract string ContentType { get; set; }
    public abstract Nullable<DateTime> Created { get; set; }
    public abstract string Creator { get; set; }
    public abstract string Description { get; set; }
    public abstract string Identifier { get; set; }
    public abstract string Keywords { get; set; }
    public abstract string Language { get; set; }
    public abstract string LastModifiedBy { get; set; }
    public abstract Nullable<DateTime> LastPrinted { get; set; }
    public abstract Nullable<DateTime> Modified { get; set; }
    public abstract string Revision { get; set; }
    public abstract string Subject { get; set; }
    public abstract string Title { get; set; }
    public abstract string Version { get; set; }
    public void Dispose();
    protected virtual void Dispose(bool disposing);
  }
  public class PackageRelationship {
    public string Id { get; }
    public Package Package { get; }
    public string RelationshipType { get; }
    public Uri SourceUri { get; }
    public TargetMode TargetMode { get; }
    public Uri TargetUri { get; }
  }
  public class PackageRelationshipCollection : IEnumerable, IEnumerable<PackageRelationship> {
    public IEnumerator<PackageRelationship> GetEnumerator();
    IEnumerator System.Collections.IEnumerable.GetEnumerator();
  }
  public sealed class PackageRelationshipSelector {
    public PackageRelationshipSelector(Uri sourceUri, PackageRelationshipSelectorType selectorType, string selectionCriteria);
    public string SelectionCriteria { get; }
    public PackageRelationshipSelectorType SelectorType { get; }
    public Uri SourceUri { get; }
    public List<PackageRelationship> Select(Package package);
  }
  public enum PackageRelationshipSelectorType {
    Id = 0,
    Type = 1,
  }
  public static class PackUriHelper {
    public static readonly string UriSchemePack;
    public static int ComparePartUri(Uri firstPartUri, Uri secondPartUri);
    public static Uri CreatePartUri(Uri partUri);
    public static Uri GetNormalizedPartUri(Uri partUri);
    public static Uri GetRelationshipPartUri(Uri partUri);
    public static Uri GetRelativeUri(Uri sourcePartUri, Uri targetPartUri);
    public static Uri GetSourcePartUriFromRelationshipPartUri(Uri relationshipPartUri);
    public static bool IsRelationshipPartUri(Uri partUri);
    public static Uri ResolvePartUri(Uri sourcePartUri, Uri targetUri);
  }
  public enum TargetMode {
    External = 1,
    Internal = 0,
  }
  public sealed class ZipPackage : Package {
    protected override PackagePart CreatePartCore(Uri partUri, string contentType, CompressionOption compressionOption);
    protected override void DeletePartCore(Uri partUri);
    protected override void Dispose(bool disposing);
    protected override void FlushCore();
    protected override PackagePart GetPartCore(Uri partUri);
    protected override PackagePart[] GetPartsCore();
  }
  public sealed class ZipPackagePart : PackagePart {
    protected override Stream GetStreamCore(FileMode streamFileMode, FileAccess streamFileAccess);
  }
}
```

## System.Linq

```csharp
namespace System.Linq {
  public static class Enumerable {
    public static IEnumerable<TSource> Append<TSource>(this IEnumerable<TSource> source, TSource element);
    public static IEnumerable<TSource> Prepend<TSource>(this IEnumerable<TSource> source, TSource element);
  }
}
```

## System.Net

```csharp
namespace System.Net {
  public class WebException : InvalidOperationException {
    public WebException(string message, Exception innerinnerException);
    public WebException(string message, Exception innerinnerException, WebExceptionStatus status, WebResponse response);
  }
}
```

## System.Net.NetworkInformation

```csharp
namespace System.Net.NetworkInformation {
  public enum DuplicateAddressDetectionState {
    Deprecated = 3,
    Duplicate = 2,
    Invalid = 0,
    Preferred = 4,
    Tentative = 1,
  }
  public abstract class GatewayIPAddressInformation {
    protected GatewayIPAddressInformation();
    public abstract IPAddress Address { get; }
  }
  public class GatewayIPAddressInformationCollection : ICollection<GatewayIPAddressInformation>, IEnumerable, IEnumerable<GatewayIPAddressInformation> {
    protected internal GatewayIPAddressInformationCollection();
    public virtual int Count { get; }
    public virtual bool IsReadOnly { get; }
    public virtual GatewayIPAddressInformation this[int index] { get; }
    public virtual void Add(GatewayIPAddressInformation address);
    public virtual void Clear();
    public virtual bool Contains(GatewayIPAddressInformation address);
    public virtual void CopyTo(GatewayIPAddressInformation[] array, int offset);
    public virtual IEnumerator<GatewayIPAddressInformation> GetEnumerator();
    public virtual bool Remove(GatewayIPAddressInformation address);
    IEnumerator System.Collections.IEnumerable.GetEnumerator();
  }
  public abstract class IcmpV4Statistics {
    protected IcmpV4Statistics();
    public abstract long AddressMaskRepliesReceived { get; }
    public abstract long AddressMaskRepliesSent { get; }
    public abstract long AddressMaskRequestsReceived { get; }
    public abstract long AddressMaskRequestsSent { get; }
    public abstract long DestinationUnreachableMessagesReceived { get; }
    public abstract long DestinationUnreachableMessagesSent { get; }
    public abstract long EchoRepliesReceived { get; }
    public abstract long EchoRepliesSent { get; }
    public abstract long EchoRequestsReceived { get; }
    public abstract long EchoRequestsSent { get; }
    public abstract long ErrorsReceived { get; }
    public abstract long ErrorsSent { get; }
    public abstract long MessagesReceived { get; }
    public abstract long MessagesSent { get; }
    public abstract long ParameterProblemsReceived { get; }
    public abstract long ParameterProblemsSent { get; }
    public abstract long RedirectsReceived { get; }
    public abstract long RedirectsSent { get; }
    public abstract long SourceQuenchesReceived { get; }
    public abstract long SourceQuenchesSent { get; }
    public abstract long TimeExceededMessagesReceived { get; }
    public abstract long TimeExceededMessagesSent { get; }
    public abstract long TimestampRepliesReceived { get; }
    public abstract long TimestampRepliesSent { get; }
    public abstract long TimestampRequestsReceived { get; }
    public abstract long TimestampRequestsSent { get; }
  }
  public abstract class IcmpV6Statistics {
    protected IcmpV6Statistics();
    public abstract long DestinationUnreachableMessagesReceived { get; }
    public abstract long DestinationUnreachableMessagesSent { get; }
    public abstract long EchoRepliesReceived { get; }
    public abstract long EchoRepliesSent { get; }
    public abstract long EchoRequestsReceived { get; }
    public abstract long EchoRequestsSent { get; }
    public abstract long ErrorsReceived { get; }
    public abstract long ErrorsSent { get; }
    public abstract long MembershipQueriesReceived { get; }
    public abstract long MembershipQueriesSent { get; }
    public abstract long MembershipReductionsReceived { get; }
    public abstract long MembershipReductionsSent { get; }
    public abstract long MembershipReportsReceived { get; }
    public abstract long MembershipReportsSent { get; }
    public abstract long MessagesReceived { get; }
    public abstract long MessagesSent { get; }
    public abstract long NeighborAdvertisementsReceived { get; }
    public abstract long NeighborAdvertisementsSent { get; }
    public abstract long NeighborSolicitsReceived { get; }
    public abstract long NeighborSolicitsSent { get; }
    public abstract long PacketTooBigMessagesReceived { get; }
    public abstract long PacketTooBigMessagesSent { get; }
    public abstract long ParameterProblemsReceived { get; }
    public abstract long ParameterProblemsSent { get; }
    public abstract long RedirectsReceived { get; }
    public abstract long RedirectsSent { get; }
    public abstract long RouterAdvertisementsReceived { get; }
    public abstract long RouterAdvertisementsSent { get; }
    public abstract long RouterSolicitsReceived { get; }
    public abstract long RouterSolicitsSent { get; }
    public abstract long TimeExceededMessagesReceived { get; }
    public abstract long TimeExceededMessagesSent { get; }
  }
  public abstract class IPAddressInformation {
    protected IPAddressInformation();
    public abstract IPAddress Address { get; }
    public abstract bool IsDnsEligible { get; }
    public abstract bool IsTransient { get; }
  }
  public class IPAddressInformationCollection : ICollection<IPAddressInformation>, IEnumerable, IEnumerable<IPAddressInformation> {
    public virtual int Count { get; }
    public virtual bool IsReadOnly { get; }
    public virtual IPAddressInformation this[int index] { get; }
    public virtual void Add(IPAddressInformation address);
    public virtual void Clear();
    public virtual bool Contains(IPAddressInformation address);
    public virtual void CopyTo(IPAddressInformation[] array, int offset);
    public virtual IEnumerator<IPAddressInformation> GetEnumerator();
    public virtual bool Remove(IPAddressInformation address);
    IEnumerator System.Collections.IEnumerable.GetEnumerator();
  }
  public abstract class IPGlobalProperties {
    protected IPGlobalProperties();
    public abstract string DhcpScopeName { get; }
    public abstract string DomainName { get; }
    public abstract string HostName { get; }
    public abstract bool IsWinsProxy { get; }
    public abstract NetBiosNodeType NodeType { get; }
    public abstract TcpConnectionInformation[] GetActiveTcpConnections();
    public abstract IPEndPoint[] GetActiveTcpListeners();
    public abstract IPEndPoint[] GetActiveUdpListeners();
    public abstract IcmpV4Statistics GetIcmpV4Statistics();
    public abstract IcmpV6Statistics GetIcmpV6Statistics();
    public static IPGlobalProperties GetIPGlobalProperties();
    public abstract IPGlobalStatistics GetIPv4GlobalStatistics();
    public abstract IPGlobalStatistics GetIPv6GlobalStatistics();
    public abstract TcpStatistics GetTcpIPv4Statistics();
    public abstract TcpStatistics GetTcpIPv6Statistics();
    public abstract UdpStatistics GetUdpIPv4Statistics();
    public abstract UdpStatistics GetUdpIPv6Statistics();
    public virtual Task<UnicastIPAddressInformationCollection> GetUnicastAddressesAsync();
  }
  public abstract class IPGlobalStatistics {
    protected IPGlobalStatistics();
    public abstract int DefaultTtl { get; }
    public abstract bool ForwardingEnabled { get; }
    public abstract int NumberOfInterfaces { get; }
    public abstract int NumberOfIPAddresses { get; }
    public abstract int NumberOfRoutes { get; }
    public abstract long OutputPacketRequests { get; }
    public abstract long OutputPacketRoutingDiscards { get; }
    public abstract long OutputPacketsDiscarded { get; }
    public abstract long OutputPacketsWithNoRoute { get; }
    public abstract long PacketFragmentFailures { get; }
    public abstract long PacketReassembliesRequired { get; }
    public abstract long PacketReassemblyFailures { get; }
    public abstract long PacketReassemblyTimeout { get; }
    public abstract long PacketsFragmented { get; }
    public abstract long PacketsReassembled { get; }
    public abstract long ReceivedPackets { get; }
    public abstract long ReceivedPacketsDelivered { get; }
    public abstract long ReceivedPacketsDiscarded { get; }
    public abstract long ReceivedPacketsForwarded { get; }
    public abstract long ReceivedPacketsWithAddressErrors { get; }
    public abstract long ReceivedPacketsWithHeadersErrors { get; }
    public abstract long ReceivedPacketsWithUnknownProtocol { get; }
  }
  public abstract class IPInterfaceProperties {
    protected IPInterfaceProperties();
    public abstract IPAddressInformationCollection AnycastAddresses { get; }
    public abstract IPAddressCollection DhcpServerAddresses { get; }
    public abstract IPAddressCollection DnsAddresses { get; }
    public abstract string DnsSuffix { get; }
    public abstract GatewayIPAddressInformationCollection GatewayAddresses { get; }
    public abstract bool IsDnsEnabled { get; }
    public abstract bool IsDynamicDnsEnabled { get; }
    public abstract MulticastIPAddressInformationCollection MulticastAddresses { get; }
    public abstract UnicastIPAddressInformationCollection UnicastAddresses { get; }
    public abstract IPAddressCollection WinsServersAddresses { get; }
    public abstract IPv4InterfaceProperties GetIPv4Properties();
    public abstract IPv6InterfaceProperties GetIPv6Properties();
  }
  public abstract class IPInterfaceStatistics {
    protected IPInterfaceStatistics();
    public abstract long BytesReceived { get; }
    public abstract long BytesSent { get; }
    public abstract long IncomingPacketsDiscarded { get; }
    public abstract long IncomingPacketsWithErrors { get; }
    public abstract long IncomingUnknownProtocolPackets { get; }
    public abstract long NonUnicastPacketsReceived { get; }
    public abstract long NonUnicastPacketsSent { get; }
    public abstract long OutgoingPacketsDiscarded { get; }
    public abstract long OutgoingPacketsWithErrors { get; }
    public abstract long OutputQueueLength { get; }
    public abstract long UnicastPacketsReceived { get; }
    public abstract long UnicastPacketsSent { get; }
  }
  public abstract class IPv4InterfaceProperties {
    protected IPv4InterfaceProperties();
    public abstract int Index { get; }
    public abstract bool IsAutomaticPrivateAddressingActive { get; }
    public abstract bool IsAutomaticPrivateAddressingEnabled { get; }
    public abstract bool IsDhcpEnabled { get; }
    public abstract bool IsForwardingEnabled { get; }
    public abstract int Mtu { get; }
    public abstract bool UsesWins { get; }
  }
  public abstract class IPv6InterfaceProperties {
    protected IPv6InterfaceProperties();
    public abstract int Index { get; }
    public abstract int Mtu { get; }
    public virtual long GetScopeId(ScopeLevel scopeLevel);
  }
  public abstract class MulticastIPAddressInformation : IPAddressInformation {
    protected MulticastIPAddressInformation();
    public abstract long AddressPreferredLifetime { get; }
    public abstract long AddressValidLifetime { get; }
    public abstract long DhcpLeaseLifetime { get; }
    public abstract DuplicateAddressDetectionState DuplicateAddressDetectionState { get; }
    public abstract PrefixOrigin PrefixOrigin { get; }
    public abstract SuffixOrigin SuffixOrigin { get; }
  }
  public class MulticastIPAddressInformationCollection : ICollection<MulticastIPAddressInformation>, IEnumerable, IEnumerable<MulticastIPAddressInformation> {
    protected internal MulticastIPAddressInformationCollection();
    public virtual int Count { get; }
    public virtual bool IsReadOnly { get; }
    public virtual MulticastIPAddressInformation this[int index] { get; }
    public virtual void Add(MulticastIPAddressInformation address);
    public virtual void Clear();
    public virtual bool Contains(MulticastIPAddressInformation address);
    public virtual void CopyTo(MulticastIPAddressInformation[] array, int offset);
    public virtual IEnumerator<MulticastIPAddressInformation> GetEnumerator();
    public virtual bool Remove(MulticastIPAddressInformation address);
    IEnumerator System.Collections.IEnumerable.GetEnumerator();
  }
  public enum NetBiosNodeType {
    Broadcast = 1,
    Hybrid = 8,
    Mixed = 4,
    Peer2Peer = 2,
    Unknown = 0,
  }
  public class NetworkInformationException : Exception {
    public NetworkInformationException();
    public NetworkInformationException(int errorCode);
    public int ErrorCode { get; }
  }
  public static abstract class NetworkInterface {
    protected NetworkInterface();
    public virtual string Description { get; }
    public virtual string Id { get; }
    public static int IPv6LoopbackInterfaceIndex { get; }
    public virtual bool IsReceiveOnly { get; }
    public static int LoopbackInterfaceIndex { get; }
    public virtual string Name { get; }
    public virtual NetworkInterfaceType NetworkInterfaceType { get; }
    public virtual OperationalStatus OperationalStatus { get; }
    public virtual long Speed { get; }
    public virtual bool SupportsMulticast { get; }
    public static NetworkInterface[] GetAllNetworkInterfaces();
    public virtual IPInterfaceProperties GetIPProperties();
    public virtual IPInterfaceStatistics GetIPStatistics();
    public virtual PhysicalAddress GetPhysicalAddress();
    public virtual bool Supports(NetworkInterfaceComponent networkInterfaceComponent);
  }
  public enum NetworkInterfaceComponent {
    IPv4 = 0,
    IPv6 = 1,
  }
  public enum NetworkInterfaceType {
    AsymmetricDsl = 94,
    Atm = 37,
    BasicIsdn = 20,
    Ethernet = 6,
    Ethernet3Megabit = 26,
    FastEthernetFx = 69,
    FastEthernetT = 62,
    Fddi = 15,
    GenericModem = 48,
    GigabitEthernet = 117,
    HighPerformanceSerialBus = 144,
    IPOverAtm = 114,
    Isdn = 63,
    Loopback = 24,
    MultiRateSymmetricDsl = 143,
    Ppp = 23,
    PrimaryIsdn = 21,
    RateAdaptDsl = 95,
    Slip = 28,
    SymmetricDsl = 96,
    TokenRing = 9,
    Tunnel = 131,
    Unknown = 1,
    VeryHighSpeedDsl = 97,
    Wireless80211 = 71,
    Wman = 237,
    Wwanpp = 243,
    Wwanpp2 = 244,
  }
  public enum OperationalStatus {
    Dormant = 5,
    Down = 2,
    LowerLayerDown = 7,
    NotPresent = 6,
    Testing = 3,
    Unknown = 4,
    Up = 1,
  }
  public class PhysicalAddress {
    public static readonly PhysicalAddress None;
    public PhysicalAddress(byte[] address);
    public override bool Equals(object comparand);
    public byte[] GetAddressBytes();
    public override int GetHashCode();
    public static PhysicalAddress Parse(string address);
    public override string ToString();
  }
  public enum PrefixOrigin {
    Dhcp = 3,
    Manual = 1,
    Other = 0,
    RouterAdvertisement = 4,
    WellKnown = 2,
  }
  public enum ScopeLevel {
    Admin = 4,
    Global = 14,
    Interface = 1,
    Link = 2,
    None = 0,
    Organization = 8,
    Site = 5,
    Subnet = 3,
  }
  public enum SuffixOrigin {
    LinkLayerAddress = 4,
    Manual = 1,
    OriginDhcp = 3,
    Other = 0,
    Random = 5,
    WellKnown = 2,
  }
  public abstract class TcpConnectionInformation {
    protected TcpConnectionInformation();
    public abstract IPEndPoint LocalEndPoint { get; }
    public abstract IPEndPoint RemoteEndPoint { get; }
    public abstract TcpState State { get; }
  }
  public enum TcpState {
    Closed = 1,
    CloseWait = 8,
    Closing = 9,
    DeleteTcb = 12,
    Established = 5,
    FinWait1 = 6,
    FinWait2 = 7,
    LastAck = 10,
    Listen = 2,
    SynReceived = 4,
    SynSent = 3,
    TimeWait = 11,
    Unknown = 0,
  }
  public abstract class TcpStatistics {
    protected TcpStatistics();
    public abstract long ConnectionsAccepted { get; }
    public abstract long ConnectionsInitiated { get; }
    public abstract long CumulativeConnections { get; }
    public abstract long CurrentConnections { get; }
    public abstract long ErrorsReceived { get; }
    public abstract long FailedConnectionAttempts { get; }
    public abstract long MaximumConnections { get; }
    public abstract long MaximumTransmissionTimeout { get; }
    public abstract long MinimumTransmissionTimeout { get; }
    public abstract long ResetConnections { get; }
    public abstract long ResetsSent { get; }
    public abstract long SegmentsReceived { get; }
    public abstract long SegmentsResent { get; }
    public abstract long SegmentsSent { get; }
  }
  public abstract class UdpStatistics {
    protected UdpStatistics();
    public abstract long DatagramsReceived { get; }
    public abstract long DatagramsSent { get; }
    public abstract long IncomingDatagramsDiscarded { get; }
    public abstract long IncomingDatagramsWithErrors { get; }
    public abstract int UdpListeners { get; }
  }
  public abstract class UnicastIPAddressInformation : IPAddressInformation {
    protected UnicastIPAddressInformation();
    public abstract long AddressPreferredLifetime { get; }
    public abstract long AddressValidLifetime { get; }
    public abstract long DhcpLeaseLifetime { get; }
    public abstract DuplicateAddressDetectionState DuplicateAddressDetectionState { get; }
    public abstract IPAddress IPv4Mask { get; }
    public virtual int PrefixLength { get; }
    public abstract PrefixOrigin PrefixOrigin { get; }
    public abstract SuffixOrigin SuffixOrigin { get; }
  }
  public class UnicastIPAddressInformationCollection : ICollection<UnicastIPAddressInformation>, IEnumerable, IEnumerable<UnicastIPAddressInformation> {
    protected internal UnicastIPAddressInformationCollection();
    public virtual int Count { get; }
    public virtual bool IsReadOnly { get; }
    public virtual UnicastIPAddressInformation this[int index] { get; }
    public virtual void Add(UnicastIPAddressInformation address);
    public virtual void Clear();
    public virtual bool Contains(UnicastIPAddressInformation address);
    public virtual void CopyTo(UnicastIPAddressInformation[] array, int offset);
    public virtual IEnumerator<UnicastIPAddressInformation> GetEnumerator();
    public virtual bool Remove(UnicastIPAddressInformation address);
    IEnumerator System.Collections.IEnumerable.GetEnumerator();
  }
}
```

## System.Net.Security

```csharp
namespace System.Net.Security {
  public abstract class AuthenticatedStream : Stream {
    protected AuthenticatedStream(Stream innerStream, bool leaveInnerStreamOpen);
    protected Stream InnerStream { get; }
    public abstract bool IsAuthenticated { get; }
    public abstract bool IsEncrypted { get; }
    public abstract bool IsMutuallyAuthenticated { get; }
    public abstract bool IsServer { get; }
    public abstract bool IsSigned { get; }
    public bool LeaveInnerStreamOpen { get; }
    protected override void Dispose(bool disposing);
  }
  public class NegotiateStream : AuthenticatedStream {
    public NegotiateStream(Stream innerStream);
    public NegotiateStream(Stream innerStream, bool leaveInnerStreamOpen);
    public override bool CanRead { get; }
    public override bool CanSeek { get; }
    public override bool CanTimeout { get; }
    public override bool CanWrite { get; }
    public virtual TokenImpersonationLevel ImpersonationLevel { get; }
    public override bool IsAuthenticated { get; }
    public override bool IsEncrypted { get; }
    public override bool IsMutuallyAuthenticated { get; }
    public override bool IsServer { get; }
    public override bool IsSigned { get; }
    public override long Length { get; }
    public override long Position { get; set; }
    public override int ReadTimeout { get; set; }
    public virtual IIdentity RemoteIdentity { get; }
    public override int WriteTimeout { get; set; }
    public virtual Task AuthenticateAsClientAsync();
    public virtual Task AuthenticateAsClientAsync(NetworkCredential credential, ChannelBinding binding, string targetName);
    public virtual Task AuthenticateAsClientAsync(NetworkCredential credential, ChannelBinding binding, string targetName, ProtectionLevel requiredProtectionLevel, TokenImpersonationLevel allowedImpersonationLevel);
    public virtual Task AuthenticateAsClientAsync(NetworkCredential credential, string targetName);
    public virtual Task AuthenticateAsClientAsync(NetworkCredential credential, string targetName, ProtectionLevel requiredProtectionLevel, TokenImpersonationLevel allowedImpersonationLevel);
    public virtual Task AuthenticateAsServerAsync();
    public virtual Task AuthenticateAsServerAsync(NetworkCredential credential, ProtectionLevel requiredProtectionLevel, TokenImpersonationLevel requiredImpersonationLevel);
    public virtual Task AuthenticateAsServerAsync(NetworkCredential credential, ExtendedProtectionPolicy policy, ProtectionLevel requiredProtectionLevel, TokenImpersonationLevel requiredImpersonationLevel);
    public virtual Task AuthenticateAsServerAsync(ExtendedProtectionPolicy policy);
    public override void Flush();
    public override int Read(byte[] buffer, int offset, int count);
    public override long Seek(long offset, SeekOrigin origin);
    public override void SetLength(long value);
    public override void Write(byte[] buffer, int offset, int count);
  }
  public enum ProtectionLevel {
    EncryptAndSign = 2,
    None = 0,
    Sign = 1,
  }
  public class SslStream : StreamAuthenticatedStream {
    public override bool IsAuthenticated { get; }
    public override bool IsEncrypted { get; }
    public override bool IsMutuallyAuthenticated { get; }
    public override bool IsServer { get; }
    public override bool IsSigned { get; }
    public virtual void AuthenticateAsClient(string targetHost);
    public virtual void AuthenticateAsClient(string targetHost, X509CertificateCollection clientCertificates, SslProtocols enabledSslProtocols, bool checkCertificateRevocation);
    public virtual void AuthenticateAsServer(X509Certificate serverCertificate);
    public virtual void AuthenticateAsServer(X509Certificate serverCertificate, bool clientCertificateRequired, SslProtocols enabledSslProtocols, bool checkCertificateRevocation);
  }
}
```

## System.Net.Sockets

```csharp
namespace System.Net.Sockets {
  public enum IOControlCode : long {
    AbsorbRouterAlert = (long)2550136837,
    AddMulticastGroupOnInterface = (long)2550136842,
    AddressListChange = (long)671088663,
    AddressListQuery = (long)1207959574,
    AddressListSort = (long)3355443225,
    AssociateHandle = (long)2281701377,
    AsyncIO = (long)2147772029,
    BindToInterface = (long)2550136840,
    DataToRead = (long)1074030207,
    DeleteMulticastGroupFromInterface = (long)2550136843,
    EnableCircularQueuing = (long)671088642,
    Flush = (long)671088644,
    GetBroadcastAddress = (long)1207959557,
    GetExtensionFunctionPointer = (long)3355443206,
    GetGroupQos = (long)3355443208,
    GetQos = (long)3355443207,
    KeepAliveValues = (long)2550136836,
    LimitBroadcasts = (long)2550136839,
    MulticastInterface = (long)2550136841,
    MulticastScope = (long)2281701386,
    MultipointLoopback = (long)2281701385,
    NamespaceChange = (long)2281701401,
    NonBlockingIO = (long)2147772030,
    OobDataRead = (long)1074033415,
    QueryTargetPnpHandle = (long)1207959576,
    ReceiveAll = (long)2550136833,
    ReceiveAllIgmpMulticast = (long)2550136835,
    ReceiveAllMulticast = (long)2550136834,
    RoutingInterfaceChange = (long)2281701397,
    RoutingInterfaceQuery = (long)3355443220,
    SetGroupQos = (long)2281701388,
    SetQos = (long)2281701387,
    TranslateHandle = (long)3355443213,
    UnicastInterface = (long)2550136838,
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct IPPacketInformation {
    public IPAddress Address { get; }
    public int Interface { get; }
    public override bool Equals(object comparand);
    public override int GetHashCode();
    public static bool operator ==(IPPacketInformation packetInformation1, IPPacketInformation packetInformation2);
    public static bool operator !=(IPPacketInformation packetInformation1, IPPacketInformation packetInformation2);
  }
  public enum IPProtectionLevel {
    EdgeRestricted = 20,
    Restricted = 30,
    Unrestricted = 10,
    Unspecified = -1,
  }
  public class IPv6MulticastOption {
    public IPv6MulticastOption(IPAddress group);
    public IPv6MulticastOption(IPAddress group, long ifindex);
    public IPAddress Group { get; set; }
    public long InterfaceIndex { get; set; }
  }
  public class LingerOption {
    public LingerOption(bool enable, int seconds);
    public bool Enabled { get; set; }
    public int LingerTime { get; set; }
  }
  public class MulticastOption {
    public MulticastOption(IPAddress group);
    public MulticastOption(IPAddress group, int interfaceIndex);
    public MulticastOption(IPAddress group, IPAddress mcint);
    public IPAddress Group { get; set; }
    public int InterfaceIndex { get; set; }
    public IPAddress LocalAddress { get; set; }
  }
  public class NetworkStream : Stream {
    public NetworkStream(Socket socket);
    public NetworkStream(Socket socket, bool ownsSocket);
    public override bool CanRead { get; }
    public override bool CanSeek { get; }
    public override bool CanTimeout { get; }
    public override bool CanWrite { get; }
    public virtual bool DataAvailable { get; }
    public override long Length { get; }
    public override long Position { get; set; }
    public override int ReadTimeout { get; set; }
    public override int WriteTimeout { get; set; }
    protected override void Dispose(bool disposing);
    ~NetworkStream();
    public override void Flush();
    public override Task FlushAsync(CancellationToken cancellationToken);
    public override int Read(byte[] buffer, int offset, int size);
    public override Task<int> ReadAsync(byte[] buffer, int offset, int size, CancellationToken cancellationToken);
    public override long Seek(long offset, SeekOrigin origin);
    public override void SetLength(long value);
    public override void Write(byte[] buffer, int offset, int size);
    public override Task WriteAsync(byte[] buffer, int offset, int size, CancellationToken cancellationToken);
  }
  public enum ProtocolType {
    Ggp = 3,
    Icmp = 1,
    IcmpV6 = 58,
    Idp = 22,
    Igmp = 2,
    IP = 0,
    IPSecAuthenticationHeader = 51,
    IPSecEncapsulatingSecurityPayload = 50,
    IPv4 = 4,
    IPv6 = 41,
    IPv6DestinationOptions = 60,
    IPv6FragmentHeader = 44,
    IPv6HopByHopOptions = 0,
    IPv6NoNextHeader = 59,
    IPv6RoutingHeader = 43,
    Ipx = 1000,
    ND = 77,
    Pup = 12,
    Raw = 255,
    Spx = 1256,
    SpxII = 1257,
  }
  public enum SelectMode {
    SelectError = 2,
    SelectRead = 0,
    SelectWrite = 1,
  }
  public class SendPacketsElement {
    public SendPacketsElement(byte[] buffer);
    public SendPacketsElement(byte[] buffer, int offset, int count);
    public SendPacketsElement(byte[] buffer, int offset, int count, bool endOfPacket);
    public SendPacketsElement(string filepath);
    public SendPacketsElement(string filepath, int offset, int count);
    public SendPacketsElement(string filepath, int offset, int count, bool endOfPacket);
    public byte[] Buffer { get; }
    public int Count { get; }
    public bool EndOfPacket { get; }
    public string FilePath { get; }
    public int Offset { get; }
  }
  public class Socket : IDisposable {
    public int Available { get; }
    public bool Blocking { get; set; }
    public bool DontFragment { get; set; }
    public bool DualMode { get; set; }
    public bool EnableBroadcast { get; set; }
    public bool ExclusiveAddressUse { get; set; }
    public bool IsBound { get; }
    public LingerOption LingerState { get; set; }
    public bool MulticastLoopback { get; set; }
    public int ReceiveTimeout { get; set; }
    public int SendTimeout { get; set; }
    public SocketType SocketType { get; }
    public Socket Accept();
    public void Connect(EndPoint remoteEP);
    public void Connect(IPAddress address, int port);
    public void Connect(IPAddress[] addresses, int port);
    public void Connect(string host, int port);
    public object GetSocketOption(SocketOptionLevel optionLevel, SocketOptionName optionName);
    public void GetSocketOption(SocketOptionLevel optionLevel, SocketOptionName optionName, byte[] optionValue);
    public byte[] GetSocketOption(SocketOptionLevel optionLevel, SocketOptionName optionName, int optionLength);
    public int IOControl(int ioControlCode, byte[] optionInValue, byte[] optionOutValue);
    public int IOControl(IOControlCode ioControlCode, byte[] optionInValue, byte[] optionOutValue);
    public bool Poll(int microSeconds, SelectMode mode);
    public int Receive(byte[] buffer);
    public int Receive(byte[] buffer, int offset, int size, SocketFlags socketFlags);
    public int Receive(byte[] buffer, int offset, int size, SocketFlags socketFlags, out SocketError errorCode);
    public int Receive(byte[] buffer, int size, SocketFlags socketFlags);
    public int Receive(byte[] buffer, SocketFlags socketFlags);
    public int Receive(IList<ArraySegment<byte>> buffers);
    public int Receive(IList<ArraySegment<byte>> buffers, SocketFlags socketFlags);
    public int Receive(IList<ArraySegment<byte>> buffers, SocketFlags socketFlags, out SocketError errorCode);
    public int ReceiveFrom(byte[] buffer, int offset, int size, SocketFlags socketFlags, ref EndPoint remoteEP);
    public int ReceiveFrom(byte[] buffer, int size, SocketFlags socketFlags, ref EndPoint remoteEP);
    public int ReceiveFrom(byte[] buffer, ref EndPoint remoteEP);
    public int ReceiveFrom(byte[] buffer, SocketFlags socketFlags, ref EndPoint remoteEP);
    public int ReceiveMessageFrom(byte[] buffer, int offset, int size, ref SocketFlags socketFlags, ref EndPoint remoteEP, out IPPacketInformation ipPacketInformation);
    public bool ReceiveMessageFromAsync(SocketAsyncEventArgs e);
    public static void Select(IList checkRead, IList checkWrite, IList checkError, int microSeconds);
    public int Send(byte[] buffer);
    public int Send(byte[] buffer, int offset, int size, SocketFlags socketFlags);
    public int Send(byte[] buffer, int offset, int size, SocketFlags socketFlags, out SocketError errorCode);
    public int Send(byte[] buffer, int size, SocketFlags socketFlags);
    public int Send(byte[] buffer, SocketFlags socketFlags);
    public int Send(IList<ArraySegment<byte>> buffers);
    public int Send(IList<ArraySegment<byte>> buffers, SocketFlags socketFlags);
    public int Send(IList<ArraySegment<byte>> buffers, SocketFlags socketFlags, out SocketError errorCode);
    public bool SendPacketsAsync(SocketAsyncEventArgs e);
    public int SendTo(byte[] buffer, int offset, int size, SocketFlags socketFlags, EndPoint remoteEP);
    public int SendTo(byte[] buffer, int size, SocketFlags socketFlags, EndPoint remoteEP);
    public int SendTo(byte[] buffer, EndPoint remoteEP);
    public int SendTo(byte[] buffer, SocketFlags socketFlags, EndPoint remoteEP);
    public void SetSocketOption(SocketOptionLevel optionLevel, SocketOptionName optionName, bool optionValue);
    public void SetSocketOption(SocketOptionLevel optionLevel, SocketOptionName optionName, byte[] optionValue);
    public void SetSocketOption(SocketOptionLevel optionLevel, SocketOptionName optionName, int optionValue);
    public void SetSocketOption(SocketOptionLevel optionLevel, SocketOptionName optionName, object optionValue);
  }
  public class SocketAsyncEventArgs : EventArgs, IDisposable {
    public IPPacketInformation ReceiveMessageFromPacketInfo { get; }
    public SendPacketsElement[] SendPacketsElements { get; set; }
    public int SendPacketsSendSize { get; set; }
    public SocketFlags SocketFlags { get; set; }
  }
  public enum SocketAsyncOperation {
    Disconnect = 3,
    ReceiveMessageFrom = 6,
    SendPackets = 8,
  }
  public enum SocketFlags {
    Broadcast = 1024,
    ControlDataTruncated = 512,
    DontRoute = 4,
    Multicast = 2048,
    None = 0,
    OutOfBand = 1,
    Partial = 32768,
    Peek = 2,
    Truncated = 256,
  }
  public enum SocketOptionLevel {
    IP = 0,
    IPv6 = 41,
    Socket = 65535,
    Tcp = 6,
    Udp = 17,
  }
  public enum SocketOptionName {
    AcceptConnection = 2,
    AddMembership = 12,
    AddSourceMembership = 15,
    BlockSource = 17,
    Broadcast = 32,
    BsdUrgent = 2,
    ChecksumCoverage = 20,
    Debug = 1,
    DontFragment = 14,
    DontLinger = -129,
    DontRoute = 16,
    DropMembership = 13,
    DropSourceMembership = 16,
    Error = 4103,
    ExclusiveAddressUse = -5,
    Expedited = 2,
    HeaderIncluded = 2,
    HopLimit = 21,
    IPOptions = 1,
    IPProtectionLevel = 23,
    IpTimeToLive = 4,
    IPv6Only = 27,
    KeepAlive = 8,
    Linger = 128,
    MaxConnections = 2147483647,
    MulticastInterface = 9,
    MulticastLoopback = 11,
    MulticastTimeToLive = 10,
    NoChecksum = 1,
    NoDelay = 1,
    OutOfBandInline = 256,
    PacketInformation = 19,
    ReceiveBuffer = 4098,
    ReceiveLowWater = 4100,
    ReceiveTimeout = 4102,
    ReuseAddress = 4,
    ReuseUnicastPort = 12295,
    SendBuffer = 4097,
    SendLowWater = 4099,
    SendTimeout = 4101,
    Type = 4104,
    TypeOfService = 3,
    UnblockSource = 18,
    UpdateAcceptContext = 28683,
    UpdateConnectContext = 28688,
    UseLoopback = 64,
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct SocketReceiveFromResult {
    public int ReceivedBytes;
    public EndPoint RemoteEndPoint;
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct SocketReceiveMessageFromResult {
    public int ReceivedBytes;
    public EndPoint RemoteEndPoint;
    public IPPacketInformation PacketInformation;
    public SocketFlags SocketFlags;
  }
  public static class SocketTaskExtensions {
    public static Task<Socket> AcceptAsync(this Socket socket);
    public static Task<Socket> AcceptAsync(this Socket socket, Socket acceptSocket);
    public static Task ConnectAsync(this Socket socket, EndPoint remoteEP);
    public static Task ConnectAsync(this Socket socket, IPAddress address, int port);
    public static Task ConnectAsync(this Socket socket, IPAddress[] addresses, int port);
    public static Task ConnectAsync(this Socket socket, string host, int port);
    public static Task<int> ReceiveAsync(this Socket socket, ArraySegment<byte> buffer, SocketFlags socketFlags);
    public static Task<int> ReceiveAsync(this Socket socket, IList<ArraySegment<byte>> buffers, SocketFlags socketFlags);
    public static Task<SocketReceiveFromResult> ReceiveFromAsync(this Socket socket, ArraySegment<byte> buffer, SocketFlags socketFlags, EndPoint remoteEndPoint);
    public static Task<SocketReceiveMessageFromResult> ReceiveMessageFromAsync(this Socket socket, ArraySegment<byte> buffer, SocketFlags socketFlags, EndPoint remoteEndPoint);
    public static Task<int> SendAsync(this Socket socket, ArraySegment<byte> buffer, SocketFlags socketFlags);
    public static Task<int> SendAsync(this Socket socket, IList<ArraySegment<byte>> buffers, SocketFlags socketFlags);
    public static Task<int> SendToAsync(this Socket socket, ArraySegment<byte> buffer, SocketFlags socketFlags, EndPoint remoteEP);
  }
  public enum SocketType {
    Raw = 3,
    Rdm = 4,
    Seqpacket = 5,
  }
  public class TcpClient : IDisposable {
    public TcpClient();
    public TcpClient(AddressFamily family);
    protected bool Active { get; set; }
    public int Available { get; }
    public bool Connected { get; }
    public bool ExclusiveAddressUse { get; set; }
    public LingerOption LingerState { get; set; }
    public bool NoDelay { get; set; }
    public int ReceiveBufferSize { get; set; }
    public int ReceiveTimeout { get; set; }
    public int SendBufferSize { get; set; }
    public int SendTimeout { get; set; }
    public Task ConnectAsync(IPAddress address, int port);
    public Task ConnectAsync(IPAddress[] addresses, int port);
    public Task ConnectAsync(string host, int port);
    public void Dispose();
    protected virtual void Dispose(bool disposing);
    ~TcpClient();
    public NetworkStream GetStream();
  }
  public class TcpListener {
    public TcpListener(IPAddress localaddr, int port);
    public TcpListener(IPEndPoint localEP);
    protected bool Active { get; }
    public bool ExclusiveAddressUse { get; set; }
    public EndPoint LocalEndpoint { get; }
    public Socket Server { get; }
    public Task<Socket> AcceptSocketAsync();
    public Task<TcpClient> AcceptTcpClientAsync();
    public bool Pending();
    public void Start();
    public void Start(int backlog);
    public void Stop();
  }
  public class UdpClient : IDisposable {
    public UdpClient();
    public UdpClient(int port);
    public UdpClient(int port, AddressFamily family);
    public UdpClient(IPEndPoint localEP);
    public UdpClient(AddressFamily family);
    protected bool Active { get; set; }
    public int Available { get; }
    public bool DontFragment { get; set; }
    public bool EnableBroadcast { get; set; }
    public bool ExclusiveAddressUse { get; set; }
    public bool MulticastLoopback { get; set; }
    public short Ttl { get; set; }
    public void Dispose();
    protected virtual void Dispose(bool disposing);
    public void DropMulticastGroup(IPAddress multicastAddr);
    public void DropMulticastGroup(IPAddress multicastAddr, int ifindex);
    public void JoinMulticastGroup(int ifindex, IPAddress multicastAddr);
    public void JoinMulticastGroup(IPAddress multicastAddr);
    public void JoinMulticastGroup(IPAddress multicastAddr, int timeToLive);
    public void JoinMulticastGroup(IPAddress multicastAddr, IPAddress localAddress);
    public Task<UdpReceiveResult> ReceiveAsync();
    public Task<int> SendAsync(byte[] datagram, int bytes, IPEndPoint endPoint);
    public Task<int> SendAsync(byte[] datagram, int bytes, string hostname, int port);
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct UdpReceiveResult : IEquatable<UdpReceiveResult> {
    public UdpReceiveResult(byte[] buffer, IPEndPoint remoteEndPoint);
    public byte[] Buffer { get; }
    public IPEndPoint RemoteEndPoint { get; }
    public bool Equals(UdpReceiveResult other);
    public override bool Equals(object obj);
    public override int GetHashCode();
    public static bool operator ==(UdpReceiveResult left, UdpReceiveResult right);
    public static bool operator !=(UdpReceiveResult left, UdpReceiveResult right);
  }
}
```

## System.Reflection

```csharp
namespace System.Reflection {
  public abstract class Assembly : ICustomAttributeProvider {
    public virtual string CodeBase { get; }
    public virtual string ImageRuntimeVersion { get; }
    public object CreateInstance(string typeName);
    public object CreateInstance(string typeName, bool ignoreCase);
    public static string CreateQualifiedName(string assemblyName, string typeName);
    public static Assembly GetEntryAssembly();
    public virtual Type[] GetExportedTypes();
    public virtual AssemblyName[] GetReferencedAssemblies();
    public virtual Type GetType(string name, bool throwOnError);
    public virtual Type[] GetTypes();
    object[] System.Reflection.ICustomAttributeProvider.GetCustomAttributes(bool inherit);
    object[] System.Reflection.ICustomAttributeProvider.GetCustomAttributes(Type attributeType, bool inherit);
    bool System.Reflection.ICustomAttributeProvider.IsDefined(Type attributeType, bool inherit);
  }
  public enum BindingFlags {
    CreateInstance = 512,
    Default = 0,
    GetField = 1024,
    GetProperty = 4096,
    InvokeMethod = 256,
    SetField = 2048,
    SetProperty = 8192,
  }
  public abstract class ConstructorInfo : MethodBase {
    public override MemberTypes MemberType { get; }
  }
  public class CustomAttributeData {
    public virtual ConstructorInfo Constructor { get; }
    public static IList<CustomAttributeData> GetCustomAttributes(Assembly target);
    public static IList<CustomAttributeData> GetCustomAttributes(MemberInfo target);
    public static IList<CustomAttributeData> GetCustomAttributes(Module target);
    public static IList<CustomAttributeData> GetCustomAttributes(ParameterInfo target);
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct CustomAttributeNamedArgument {
    public override bool Equals(object obj);
    public override int GetHashCode();
    public static bool operator ==(CustomAttributeNamedArgument left, CustomAttributeNamedArgument right);
    public static bool operator !=(CustomAttributeNamedArgument left, CustomAttributeNamedArgument right);
    public override string ToString();
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct CustomAttributeTypedArgument {
    public override bool Equals(object obj);
    public override int GetHashCode();
    public static bool operator ==(CustomAttributeTypedArgument left, CustomAttributeTypedArgument right);
    public static bool operator !=(CustomAttributeTypedArgument left, CustomAttributeTypedArgument right);
    public override string ToString();
  }
  public abstract class EventInfo : MemberInfo {
    public virtual bool IsMulticast { get; }
    public override MemberTypes MemberType { get; }
    public MethodInfo GetAddMethod();
    public abstract MethodInfo GetAddMethod(bool nonPublic);
    public MethodInfo GetRaiseMethod();
    public abstract MethodInfo GetRaiseMethod(bool nonPublic);
    public MethodInfo GetRemoveMethod();
    public abstract MethodInfo GetRemoveMethod(bool nonPublic);
  }
  public abstract class FieldInfo : MemberInfo {
    public override MemberTypes MemberType { get; }
    public virtual Type[] GetOptionalCustomModifiers();
    public virtual object GetRawConstantValue();
    public virtual Type[] GetRequiredCustomModifiers();
  }
  public interface ICustomAttributeProvider {
    object[] GetCustomAttributes(bool inherit);
    object[] GetCustomAttributes(Type attributeType, bool inherit);
    bool IsDefined(Type attributeType, bool inherit);
  }
  public class InvalidFilterCriteriaException : Exception {
    public InvalidFilterCriteriaException();
    public InvalidFilterCriteriaException(string message);
    public InvalidFilterCriteriaException(string message, Exception inner);
  }
  public delegate bool MemberFilter(MemberInfo m, object filterCriteria);
  public abstract class MemberInfo : ICustomAttributeProvider {
    public abstract MemberTypes MemberType { get; }
    public virtual int MetadataToken { get; }
    object[] System.Reflection.ICustomAttributeProvider.GetCustomAttributes(bool inherit);
    object[] System.Reflection.ICustomAttributeProvider.GetCustomAttributes(Type attributeType, bool inherit);
    bool System.Reflection.ICustomAttributeProvider.IsDefined(Type attributeType, bool inherit);
  }
  public enum MemberTypes {
    All = 191,
    Constructor = 1,
    Custom = 64,
    Event = 2,
    Field = 4,
    Method = 8,
    NestedType = 128,
    Property = 16,
    TypeInfo = 32,
  }
  public abstract class MethodBase : MemberInfo {
    public abstract MethodImplAttributes GetMethodImplementationFlags();
  }
  public abstract class MethodInfo : MethodBase {
    public override MemberTypes MemberType { get; }
    public abstract ICustomAttributeProvider ReturnTypeCustomAttributes { get; }
    public abstract MethodInfo GetBaseDefinition();
  }
  public abstract class Module : ICustomAttributeProvider {
    public static readonly TypeFilter FilterTypeName;
    public static readonly TypeFilter FilterTypeNameIgnoreCase;
    public virtual Guid ModuleVersionId { get; }
    public virtual string ScopeName { get; }
    public virtual Type[] FindTypes(TypeFilter filter, object filterCriteria);
    public FieldInfo GetField(string name);
    public virtual FieldInfo GetField(string name, BindingFlags bindingAttr);
    public FieldInfo[] GetFields();
    public virtual FieldInfo[] GetFields(BindingFlags bindingFlags);
    public MethodInfo GetMethod(string name);
    public MethodInfo GetMethod(string name, Type[] types);
    public MethodInfo[] GetMethods();
    public virtual MethodInfo[] GetMethods(BindingFlags bindingFlags);
    public virtual Type GetType(string className);
    public virtual Type GetType(string className, bool ignoreCase);
    public virtual Type[] GetTypes();
    object[] System.Reflection.ICustomAttributeProvider.GetCustomAttributes(bool inherit);
    object[] System.Reflection.ICustomAttributeProvider.GetCustomAttributes(Type attributeType, bool inherit);
    bool System.Reflection.ICustomAttributeProvider.IsDefined(Type attributeType, bool inherit);
  }
  public class ParameterInfo : ICustomAttributeProvider {
    public virtual object RawDefaultValue { get; }
    public virtual Type[] GetOptionalCustomModifiers();
    public virtual Type[] GetRequiredCustomModifiers();
    object[] System.Reflection.ICustomAttributeProvider.GetCustomAttributes(bool inherit);
    object[] System.Reflection.ICustomAttributeProvider.GetCustomAttributes(Type attributeType, bool inherit);
    bool System.Reflection.ICustomAttributeProvider.IsDefined(Type attributeType, bool inherit);
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ParameterModifier {
    public ParameterModifier(int parameterCount);
    public bool this[int index] { get; set; }
  }
  public abstract class PropertyInfo : MemberInfo {
    public override MemberTypes MemberType { get; }
    public MethodInfo[] GetAccessors();
    public abstract MethodInfo[] GetAccessors(bool nonPublic);
    public MethodInfo GetGetMethod();
    public abstract MethodInfo GetGetMethod(bool nonPublic);
    public virtual Type[] GetOptionalCustomModifiers();
    public virtual object GetRawConstantValue();
    public virtual Type[] GetRequiredCustomModifiers();
    public MethodInfo GetSetMethod();
    public abstract MethodInfo GetSetMethod(bool nonPublic);
  }
  public class TargetException : Exception {
    public TargetException();
    public TargetException(string message);
    public TargetException(string message, Exception inner);
  }
  public delegate bool TypeFilter(Type m, object filterCriteria);
  public abstract class TypeInfo : MemberInfo, IReflectableType {
    public override MemberTypes MemberType { get; }
    public virtual StructLayoutAttribute StructLayoutAttribute { get; }
    public ConstructorInfo TypeInitializer { get; }
    public virtual Type UnderlyingSystemType { get; }
    public virtual Type[] FindInterfaces(TypeFilter filter, object filterCriteria);
    public virtual MemberInfo[] FindMembers(MemberTypes memberType, BindingFlags bindingAttr, MemberFilter filter, object filterCriteria);
    public ConstructorInfo GetConstructor(Type[] types);
    public ConstructorInfo[] GetConstructors();
    public virtual ConstructorInfo[] GetConstructors(BindingFlags bindingAttr);
    public virtual MemberInfo[] GetDefaultMembers();
    public virtual string GetEnumName(object value);
    public virtual string[] GetEnumNames();
    public virtual Type GetEnumUnderlyingType();
    public virtual Array GetEnumValues();
    public EventInfo GetEvent(string name);
    public virtual EventInfo GetEvent(string name, BindingFlags bindingAttr);
    public virtual EventInfo[] GetEvents();
    public virtual EventInfo[] GetEvents(BindingFlags bindingAttr);
    public FieldInfo GetField(string name);
    public virtual FieldInfo GetField(string name, BindingFlags bindingAttr);
    public FieldInfo[] GetFields();
    public virtual FieldInfo[] GetFields(BindingFlags bindingAttr);
    public virtual Type[] GetGenericArguments();
    public Type GetInterface(string name);
    public virtual Type GetInterface(string name, bool ignoreCase);
    public virtual Type[] GetInterfaces();
    public MemberInfo[] GetMember(string name);
    public virtual MemberInfo[] GetMember(string name, BindingFlags bindingAttr);
    public virtual MemberInfo[] GetMember(string name, MemberTypes type, BindingFlags bindingAttr);
    public MemberInfo[] GetMembers();
    public virtual MemberInfo[] GetMembers(BindingFlags bindingAttr);
    public MethodInfo GetMethod(string name);
    public MethodInfo GetMethod(string name, BindingFlags bindingAttr);
    public MethodInfo GetMethod(string name, Type[] types);
    public MethodInfo GetMethod(string name, Type[] types, ParameterModifier[] modifiers);
    public MethodInfo[] GetMethods();
    public virtual MethodInfo[] GetMethods(BindingFlags bindingAttr);
    public Type GetNestedType(string name);
    public virtual Type GetNestedType(string name, BindingFlags bindingAttr);
    public Type[] GetNestedTypes();
    public virtual Type[] GetNestedTypes(BindingFlags bindingAttr);
    public PropertyInfo[] GetProperties();
    public virtual PropertyInfo[] GetProperties(BindingFlags bindingAttr);
    public PropertyInfo GetProperty(string name);
    public PropertyInfo GetProperty(string name, BindingFlags bindingAttr);
    public PropertyInfo GetProperty(string name, Type returnType);
    public PropertyInfo GetProperty(string name, Type returnType, Type[] types);
    public PropertyInfo GetProperty(string name, Type returnType, Type[] types, ParameterModifier[] modifiers);
    public PropertyInfo GetProperty(string name, Type[] types);
    public virtual bool IsAssignableFrom(Type c);
    public virtual bool IsEnumDefined(object value);
    public virtual bool IsEquivalentTo(Type other);
    public virtual bool IsInstanceOfType(object o);
  }
}
```

## System.Runtime.InteropServices

```csharp
namespace System.Runtime.InteropServices {
  public enum Architecture {
    Arm = 2,
    Arm64 = 3,
    X64 = 1,
    X86 = 0,
  }
  public static class PInvokeMarshal {
    public static readonly int SystemDefaultCharSize;
    public static readonly int SystemMaxDBCSCharSize;
    public static IntPtr AllocateMemory(int sizeInBytes);
    public static void DestroyStructure(IntPtr ptr, Type structureType);
    public static void DestroyStructure<T>(IntPtr ptr);
    public static void FreeMemory(IntPtr ptr);
    public static Delegate GetDelegateForFunctionPointer(IntPtr ptr, Type delegateType);
    public static TDelegate GetDelegateForFunctionPointer<TDelegate>(IntPtr ptr);
    public static IntPtr GetFunctionPointerForDelegate(Delegate d);
    public static IntPtr GetFunctionPointerForDelegate<TDelegate>(TDelegate d);
    public static int GetLastError();
    public static IntPtr OffsetOf(Type type, string fieldName);
    public static IntPtr OffsetOf<T>(string fieldName);
    public static string PtrToStringAnsi(IntPtr ptr);
    public static string PtrToStringAnsi(IntPtr ptr, int len);
    public static string PtrToStringUTF16(IntPtr ptr);
    public static string PtrToStringUTF16(IntPtr ptr, int len);
    public static void PtrToStructure(IntPtr ptr, object structure);
    public static object PtrToStructure(IntPtr ptr, Type structureType);
    public static T PtrToStructure<T>(IntPtr ptr);
    public static void PtrToStructure<T>(IntPtr ptr, T structure);
    public static IntPtr ReallocateMemory(IntPtr ptr, int sizeInBytes);
    public static int SizeOf(object structure);
    public static int SizeOf(Type type);
    public static int SizeOf<T>();
    public static IntPtr StringToAllocatedMemoryAnsi(string s);
    public static IntPtr StringToAllocatedMemoryUTF16(string s);
    public static void StructureToPtr(object structure, IntPtr ptr, bool fDeleteOld);
    public static void StructureToPtr<T>(T structure, IntPtr ptr, bool fDeleteOld);
    public static IntPtr UnsafeAddrOfPinnedArrayElement(Array arr, int index);
    public static IntPtr UnsafeAddrOfPinnedArrayElement<T>(T[] arr, int index);
    public static void ZeroFreeMemoryAnsi(IntPtr s);
    public static void ZeroFreeMemoryUTF16(IntPtr s);
  }
  public static class RuntimeInformation {
    public static string FrameworkDescription { get; }
    public static Architecture OSArchitecture { get; }
    public static string OSDescription { get; }
    public static Architecture ProcessArchitecture { get; }
  }
}
```

## System.Runtime.Loader

```csharp
namespace System.Runtime.Loader {
  public abstract class AssemblyLoadContext {
    public event Func<AssemblyLoadContext, AssemblyName, Assembly> Resolving;
    public event Action<AssemblyLoadContext> Unloading;
    protectedpublic Assembly LoadFromAssemblyPath(string assemblyPath);
    protectedpublic Assembly LoadFromNativeImagePath(string nativeImagePath, string assemblyPath);
    protectedpublic Assembly LoadFromStream(Stream assembly);
    protectedpublic Assembly LoadFromStream(Stream assembly, Stream assemblySymbols);
  }
}
```

## System.Runtime.Serialization

```csharp
namespace System.Runtime.Serialization {
  public sealed class DataContractSerializer : XmlObjectSerializer {
    public ISerializationSurrogateProvider SerializationSurrogateProvider { get; set; }
  }
  public static class DataContractSerializerExtensions {
    public static ISerializationSurrogateProvider GetSerializationSurrogateProvider(this DataContractSerializer serializer);
    public static void SetSerializationSurrogateProvider(this DataContractSerializer serializer, ISerializationSurrogateProvider provider);
  }
}
```

## System.Security.Cryptography

```csharp
namespace System.Security.Cryptography {
  public abstract class Aes : SymmetricAlgorithm {
    public override KeySizes[] LegalBlockSizes { get; }
    public override KeySizes[] LegalKeySizes { get; }
  }
  public class HMACMD5 : HMAC {
    public HMACMD5();
    public HMACMD5(byte[] key);
    public override int HashSize { get; }
    public override byte[] Key { get; set; }
    protected override void Dispose(bool disposing);
    protected override void HashCore(byte[] rgb, int ib, int cb);
    protected override byte[] HashFinal();
    public override void Initialize();
  }
  public class HMACSHA1 : HMAC {
    public override int HashSize { get; }
    public override byte[] Key { get; set; }
    protected override void Dispose(bool disposing);
    protected override void HashCore(byte[] rgb, int ib, int cb);
    protected override byte[] HashFinal();
    public override void Initialize();
  }
  public class HMACSHA256 : HMAC {
    public override int HashSize { get; }
    public override byte[] Key { get; set; }
    protected override void Dispose(bool disposing);
    protected override void HashCore(byte[] rgb, int ib, int cb);
    protected override byte[] HashFinal();
    public override void Initialize();
  }
  public class HMACSHA384 : HMAC {
    public override int HashSize { get; }
    public override byte[] Key { get; set; }
    protected override void Dispose(bool disposing);
    protected override void HashCore(byte[] rgb, int ib, int cb);
    protected override byte[] HashFinal();
    public override void Initialize();
  }
  public class HMACSHA512 : HMAC {
    public override int HashSize { get; }
    public override byte[] Key { get; set; }
    protected override void Dispose(bool disposing);
    protected override void HashCore(byte[] rgb, int ib, int cb);
    protected override byte[] HashFinal();
    public override void Initialize();
  }
  public abstract class RSA : AsymmetricAlgorithm {
    public static RSA Create();
  }
  public sealed class RSACryptoServiceProvider : RSA, ICspAsymmetricAlgorithm {
    public override KeySizes[] LegalKeySizes { get; }
  }
}
```

## System.Security.Cryptography.X509Certificates

```csharp
namespace System.Security.Cryptography.X509Certificates {
  public enum X509ChainStatusFlags {
    ExplicitDistrust = 67108864,
    HasNotSupportedCriticalExtension = 134217728,
    HasWeakSignature = 1048576,
  }
}
```

## System.Security.Principal

```csharp
namespace System.Security.Principal {
  public class WindowsIdentity : ClaimsIdentity, IDisposable {
    public const string DefaultIssuer = "AD AUTHORITY";
    public sealed override string AuthenticationType { get; }
    public override IEnumerable<Claim> Claims { get; }
    public override bool IsAuthenticated { get; }
    public override string Name { get; }
    public override ClaimsIdentity Clone();
  }
  public class WindowsPrincipal : ClaimsPrincipal {
    public override IIdentity Identity { get; }
    public override bool IsInRole(string role);
  }
}
```

## System.ServiceModel

```csharp
namespace System.ServiceModel {
  public class BasicHttpsBinding : HttpBindingBase {
    public BasicHttpsBinding();
    public BasicHttpsBinding(BasicHttpsSecurityMode securityMode);
    public BasicHttpsSecurity Security { get; set; }
    public override IChannelFactory<TChannel> BuildChannelFactory<TChannel>(BindingParameterCollection parameters);
    public override BindingElementCollection CreateBindingElements();
  }
  public sealed class BasicHttpsSecurity {
    public BasicHttpsSecurityMode Mode { get; set; }
    public HttpTransportSecurity Transport { get; set; }
  }
  public enum BasicHttpsSecurityMode {
    Transport = 0,
    TransportWithMessageCredential = 1,
  }
  public class MessageHeaderAttribute : MessageContractMemberAttribute {
    public MessageHeaderAttribute();
    public bool MustUnderstand { get; set; }
  }
  public class NetHttpsBinding : HttpBindingBase {
    public NetHttpsBinding();
    public NetHttpsBinding(BasicHttpsSecurityMode securityMode);
    public NetHttpMessageEncoding MessageEncoding { get; set; }
    public BasicHttpsSecurity Security { get; set; }
    public WebSocketTransportSettings WebSocketSettings { get; }
    public override IChannelFactory<TChannel> BuildChannelFactory<TChannel>(BindingParameterCollection parameters);
    public override BindingElementCollection CreateBindingElements();
  }
}
```

## System.ServiceModel.Channels

```csharp
namespace System.ServiceModel.Channels {
  public class HttpsTransportBindingElement : HttpTransportBindingElement {
    public bool RequireClientCertificate { get; set; }
  }
}
```