# Microsoft.VisualBasic.CompilerServices

``` diff
+namespace Microsoft.VisualBasic.CompilerServices {
+    public sealed class Conversions {
+        public static object ChangeType(object Expression, Type TargetType);
+        public static bool ToBoolean(object Value);
+        public static bool ToBoolean(string Value);
+        public static byte ToByte(object Value);
+        public static byte ToByte(string Value);
+        public static char ToChar(object Value);
+        public static char ToChar(string Value);
+        public static char[] ToCharArrayRankOne(object Value);
+        public static char[] ToCharArrayRankOne(string Value);
+        public static DateTime ToDate(object Value);
+        public static DateTime ToDate(string Value);
+        public static Decimal ToDecimal(bool Value);
+        public static Decimal ToDecimal(object Value);
+        public static Decimal ToDecimal(string Value);
+        public static double ToDouble(object Value);
+        public static double ToDouble(string Value);
+        public static T ToGenericParameter<T>(object Value);
+        public static int ToInteger(object Value);
+        public static int ToInteger(string Value);
+        public static long ToLong(object Value);
+        public static long ToLong(string Value);
+        public static sbyte ToSByte(object Value);
+        public static sbyte ToSByte(string Value);
+        public static short ToShort(object Value);
+        public static short ToShort(string Value);
+        public static float ToSingle(object Value);
+        public static float ToSingle(string Value);
+        public static string ToString(bool Value);
+        public static string ToString(byte Value);
+        public static string ToString(char Value);
+        public static string ToString(DateTime Value);
+        public static string ToString(Decimal Value);
+        public static string ToString(double Value);
+        public static string ToString(short Value);
+        public static string ToString(int Value);
+        public static string ToString(long Value);
+        public static string ToString(object Value);
+        public static string ToString(float Value);
+        public static string ToString(uint Value);
+        public static string ToString(ulong Value);
+        public static uint ToUInteger(object Value);
+        public static uint ToUInteger(string Value);
+        public static ulong ToULong(object Value);
+        public static ulong ToULong(string Value);
+        public static ushort ToUShort(object Value);
+        public static ushort ToUShort(string Value);
+    }
+    public sealed class DesignerGeneratedAttribute : Attribute {
+        public DesignerGeneratedAttribute();
+    }
+    public sealed class IncompleteInitialization : Exception {
+        public IncompleteInitialization();
+    }
+    public sealed class NewLateBinding {
+        public static object LateCall(object Instance, Type Type, string MemberName, object[] Arguments, string[] ArgumentNames, Type[] TypeArguments, bool[] CopyBack, bool IgnoreReturn);
+        public static object LateGet(object Instance, Type Type, string MemberName, object[] Arguments, string[] ArgumentNames, Type[] TypeArguments, bool[] CopyBack);
+        public static object LateIndexGet(object Instance, object[] Arguments, string[] ArgumentNames);
+        public static void LateIndexSet(object Instance, object[] Arguments, string[] ArgumentNames);
+        public static void LateIndexSetComplex(object Instance, object[] Arguments, string[] ArgumentNames, bool OptimisticSet, bool RValueBase);
+        public static void LateSet(object Instance, Type Type, string MemberName, object[] Arguments, string[] ArgumentNames, Type[] TypeArguments);
+        public static void LateSet(object Instance, Type Type, string MemberName, object[] Arguments, string[] ArgumentNames, Type[] TypeArguments, bool OptimisticSet, bool RValueBase, CallType CallType);
+        public static void LateSetComplex(object Instance, Type Type, string MemberName, object[] Arguments, string[] ArgumentNames, Type[] TypeArguments, bool OptimisticSet, bool RValueBase);
+    }
+    public sealed class ObjectFlowControl {
+        public static void CheckForSyncLockOnValueType(object Expression);
+        public sealed class ForLoopControl {
+            public static bool ForLoopInitObj(object Counter, object Start, object Limit, object StepValue, ref object LoopForResult, ref object CounterResult);
+            public static bool ForNextCheckDec(Decimal count, Decimal limit, Decimal StepValue);
+            public static bool ForNextCheckObj(object Counter, object LoopObj, ref object CounterResult);
+            public static bool ForNextCheckR4(float count, float limit, float StepValue);
+            public static bool ForNextCheckR8(double count, double limit, double StepValue);
+        }
+    }
+    public sealed class Operators {
+        public static object AddObject(object Left, object Right);
+        public static object AndObject(object Left, object Right);
+        public static object CompareObjectEqual(object Left, object Right, bool TextCompare);
+        public static object CompareObjectGreater(object Left, object Right, bool TextCompare);
+        public static object CompareObjectGreaterEqual(object Left, object Right, bool TextCompare);
+        public static object CompareObjectLess(object Left, object Right, bool TextCompare);
+        public static object CompareObjectLessEqual(object Left, object Right, bool TextCompare);
+        public static object CompareObjectNotEqual(object Left, object Right, bool TextCompare);
+        public static int CompareString(string Left, string Right, bool TextCompare);
+        public static object ConcatenateObject(object Left, object Right);
+        public static bool ConditionalCompareObjectEqual(object Left, object Right, bool TextCompare);
+        public static bool ConditionalCompareObjectGreater(object Left, object Right, bool TextCompare);
+        public static bool ConditionalCompareObjectGreaterEqual(object Left, object Right, bool TextCompare);
+        public static bool ConditionalCompareObjectLess(object Left, object Right, bool TextCompare);
+        public static bool ConditionalCompareObjectLessEqual(object Left, object Right, bool TextCompare);
+        public static bool ConditionalCompareObjectNotEqual(object Left, object Right, bool TextCompare);
+        public static object DivideObject(object Left, object Right);
+        public static object ExponentObject(object Left, object Right);
+        public static object IntDivideObject(object Left, object Right);
+        public static object LeftShiftObject(object Operand, object Amount);
+        public static object ModObject(object Left, object Right);
+        public static object MultiplyObject(object Left, object Right);
+        public static object NegateObject(object Operand);
+        public static object NotObject(object Operand);
+        public static object OrObject(object Left, object Right);
+        public static object PlusObject(object Operand);
+        public static object RightShiftObject(object Operand, object Amount);
+        public static object SubtractObject(object Left, object Right);
+        public static object XorObject(object Left, object Right);
+    }
+    public sealed class OptionCompareAttribute : Attribute {
+        public OptionCompareAttribute();
+    }
+    public sealed class OptionTextAttribute : Attribute {
+        public OptionTextAttribute();
+    }
+    public sealed class ProjectData {
+        public static void ClearProjectError();
+        public static void SetProjectError(Exception ex);
+        public static void SetProjectError(Exception ex, int lErl);
+    }
+    public sealed class StandardModuleAttribute : Attribute {
+        public StandardModuleAttribute();
+    }
+    public sealed class StaticLocalInitFlag {
+        public short State;
+        public StaticLocalInitFlag();
+    }
+    public sealed class Utils {
+        public static Array CopyArray(Array arySrc, Array aryDest);
+    }
+}
```

