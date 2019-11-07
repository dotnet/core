# System.Diagnostics.PerformanceData

``` diff
+namespace System.Diagnostics.PerformanceData {
+    public sealed class CounterData {
+        public long RawValue { get; set; }
+        public long Value { get; set; }
+        public void Decrement();
+        public void Increment();
+        public void IncrementBy(long value);
+    }
+    public class CounterSet : IDisposable {
+        public CounterSet(Guid providerGuid, Guid counterSetGuid, CounterSetInstanceType instanceType);
+        public void AddCounter(int counterId, CounterType counterType);
+        public void AddCounter(int counterId, CounterType counterType, string counterName);
+        public CounterSetInstance CreateCounterSetInstance(string instanceName);
+        public void Dispose();
+        protected virtual void Dispose(bool disposing);
+        ~CounterSet();
+    }
+    public sealed class CounterSetInstance : IDisposable {
+        public CounterSetInstanceCounterDataSet Counters { get; }
+        public void Dispose();
+        ~CounterSetInstance();
+    }
+    public sealed class CounterSetInstanceCounterDataSet : IDisposable {
+        public CounterData this[int counterId] { get; }
+        public CounterData this[string counterName] { get; }
+        public void Dispose();
+        ~CounterSetInstanceCounterDataSet();
+    }
+    public enum CounterSetInstanceType {
+        GlobalAggregate = 4,
+        GlobalAggregateWithHistory = 11,
+        InstanceAggregate = 22,
+        Multiple = 2,
+        MultipleAggregate = 6,
+        Single = 0,
+    }
+    public enum CounterType {
+        AverageBase = 1073939458,
+        AverageCount64 = 1073874176,
+        AverageTimer32 = 805438464,
+        Delta32 = 4195328,
+        Delta64 = 4195584,
+        ElapsedTime = 807666944,
+        LargeQueueLength = 4523264,
+        MultiTimerBase = 1107494144,
+        MultiTimerPercentageActive = 574686464,
+        MultiTimerPercentageActive100Ns = 575735040,
+        MultiTimerPercentageNotActive = 591463680,
+        MultiTimerPercentageNotActive100Ns = 592512256,
+        ObjectSpecificTimer = 543229184,
+        PercentageActive = 541132032,
+        PercentageActive100Ns = 542180608,
+        PercentageNotActive = 557909248,
+        PercentageNotActive100Ns = 558957824,
+        PrecisionObjectSpecificTimer = 543622400,
+        PrecisionSystemTimer = 541525248,
+        PrecisionTimer100Ns = 542573824,
+        QueueLength = 4523008,
+        QueueLength100Ns = 5571840,
+        QueueLengthObjectTime = 6620416,
+        RateOfCountPerSecond32 = 272696320,
+        RateOfCountPerSecond64 = 272696576,
+        RawBase32 = 1073939459,
+        RawBase64 = 1073939712,
+        RawData32 = 65536,
+        RawData64 = 65792,
+        RawDataHex32 = 0,
+        RawDataHex64 = 256,
+        RawFraction32 = 537003008,
+        RawFraction64 = 537003264,
+        SampleBase = 1073939457,
+        SampleCounter = 4260864,
+        SampleFraction = 549585920,
+    }
+}
```

