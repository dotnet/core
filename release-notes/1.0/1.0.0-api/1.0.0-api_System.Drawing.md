# System.Drawing

``` diff
+namespace System.Drawing {
+    [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
+    public struct Point {
+        public static readonly Point Empty;
+        public Point(Size sz);
+        public Point(int dw);
+        public Point(int x, int y);
+        public bool IsEmpty { get; }
+        public int X { get; set; }
+        public int Y { get; set; }
+        public static Point Add(Point pt, Size sz);
+        public static Point Ceiling(PointF value);
+        public override bool Equals(object obj);
+        public override int GetHashCode();
+        public void Offset(Point p);
+        public void Offset(int dx, int dy);
+        public static Point operator +(Point pt, Size sz);
+        public static bool operator ==(Point left, Point right);
+        public static explicit operator Size (Point p);
+        public static implicit operator PointF (Point p);
+        public static bool operator !=(Point left, Point right);
+        public static Point operator -(Point pt, Size sz);
+        public static Point Round(PointF value);
+        public static Point Subtract(Point pt, Size sz);
+        public override string ToString();
+        public static Point Truncate(PointF value);
+    }
+    [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
+    public struct PointF {
+        public static readonly PointF Empty;
+        public PointF(float x, float y);
+        public bool IsEmpty { get; }
+        public float X { get; set; }
+        public float Y { get; set; }
+        public static PointF Add(PointF pt, Size sz);
+        public static PointF Add(PointF pt, SizeF sz);
+        public override bool Equals(object obj);
+        public override int GetHashCode();
+        public static PointF operator +(PointF pt, Size sz);
+        public static PointF operator +(PointF pt, SizeF sz);
+        public static bool operator ==(PointF left, PointF right);
+        public static bool operator !=(PointF left, PointF right);
+        public static PointF operator -(PointF pt, Size sz);
+        public static PointF operator -(PointF pt, SizeF sz);
+        public static PointF Subtract(PointF pt, Size sz);
+        public static PointF Subtract(PointF pt, SizeF sz);
+        public override string ToString();
+    }
+    [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
+    public struct Rectangle {
+        public static readonly Rectangle Empty;
+        public Rectangle(Point location, Size size);
+        public Rectangle(int x, int y, int width, int height);
+        public int Bottom { get; }
+        public int Height { get; set; }
+        public bool IsEmpty { get; }
+        public int Left { get; }
+        public Point Location { get; set; }
+        public int Right { get; }
+        public Size Size { get; set; }
+        public int Top { get; }
+        public int Width { get; set; }
+        public int X { get; set; }
+        public int Y { get; set; }
+        public static Rectangle Ceiling(RectangleF value);
+        public bool Contains(Point pt);
+        public bool Contains(Rectangle rect);
+        public bool Contains(int x, int y);
+        public override bool Equals(object obj);
+        public static Rectangle FromLTRB(int left, int top, int right, int bottom);
+        public override int GetHashCode();
+        public static Rectangle Inflate(Rectangle rect, int x, int y);
+        public void Inflate(Size size);
+        public void Inflate(int width, int height);
+        public void Intersect(Rectangle rect);
+        public static Rectangle Intersect(Rectangle a, Rectangle b);
+        public bool IntersectsWith(Rectangle rect);
+        public void Offset(Point pos);
+        public void Offset(int x, int y);
+        public static bool operator ==(Rectangle left, Rectangle right);
+        public static bool operator !=(Rectangle left, Rectangle right);
+        public static Rectangle Round(RectangleF value);
+        public override string ToString();
+        public static Rectangle Truncate(RectangleF value);
+        public static Rectangle Union(Rectangle a, Rectangle b);
+    }
+    [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
+    public struct RectangleF {
+        public static readonly RectangleF Empty;
+        public RectangleF(PointF location, SizeF size);
+        public RectangleF(float x, float y, float width, float height);
+        public float Bottom { get; }
+        public float Height { get; set; }
+        public bool IsEmpty { get; }
+        public float Left { get; }
+        public PointF Location { get; set; }
+        public float Right { get; }
+        public SizeF Size { get; set; }
+        public float Top { get; }
+        public float Width { get; set; }
+        public float X { get; set; }
+        public float Y { get; set; }
+        public bool Contains(PointF pt);
+        public bool Contains(RectangleF rect);
+        public bool Contains(float x, float y);
+        public override bool Equals(object obj);
+        public static RectangleF FromLTRB(float left, float top, float right, float bottom);
+        public override int GetHashCode();
+        public static RectangleF Inflate(RectangleF rect, float x, float y);
+        public void Inflate(SizeF size);
+        public void Inflate(float x, float y);
+        public void Intersect(RectangleF rect);
+        public static RectangleF Intersect(RectangleF a, RectangleF b);
+        public bool IntersectsWith(RectangleF rect);
+        public void Offset(PointF pos);
+        public void Offset(float x, float y);
+        public static bool operator ==(RectangleF left, RectangleF right);
+        public static implicit operator RectangleF (Rectangle r);
+        public static bool operator !=(RectangleF left, RectangleF right);
+        public override string ToString();
+        public static RectangleF Union(RectangleF a, RectangleF b);
+    }
+    [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
+    public struct Size {
+        public static readonly Size Empty;
+        public Size(Point pt);
+        public Size(int width, int height);
+        public int Height { get; set; }
+        public bool IsEmpty { get; }
+        public int Width { get; set; }
+        public static Size Add(Size sz1, Size sz2);
+        public static Size Ceiling(SizeF value);
+        public override bool Equals(object obj);
+        public override int GetHashCode();
+        public static Size operator +(Size sz1, Size sz2);
+        public static bool operator ==(Size sz1, Size sz2);
+        public static explicit operator Point (Size size);
+        public static implicit operator SizeF (Size p);
+        public static bool operator !=(Size sz1, Size sz2);
+        public static Size operator -(Size sz1, Size sz2);
+        public static Size Round(SizeF value);
+        public static Size Subtract(Size sz1, Size sz2);
+        public override string ToString();
+        public static Size Truncate(SizeF value);
+    }
+    [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
+    public struct SizeF {
+        public static readonly SizeF Empty;
+        public SizeF(PointF pt);
+        public SizeF(SizeF size);
+        public SizeF(float width, float height);
+        public float Height { get; set; }
+        public bool IsEmpty { get; }
+        public float Width { get; set; }
+        public static SizeF Add(SizeF sz1, SizeF sz2);
+        public override bool Equals(object obj);
+        public override int GetHashCode();
+        public static SizeF operator +(SizeF sz1, SizeF sz2);
+        public static bool operator ==(SizeF sz1, SizeF sz2);
+        public static explicit operator PointF (SizeF size);
+        public static bool operator !=(SizeF sz1, SizeF sz2);
+        public static SizeF operator -(SizeF sz1, SizeF sz2);
+        public static SizeF Subtract(SizeF sz1, SizeF sz2);
+        public PointF ToPointF();
+        public Size ToSize();
+        public override string ToString();
+    }
+}
```

