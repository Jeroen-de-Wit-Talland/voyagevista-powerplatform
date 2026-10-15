using DataverseUnitTest;

[assembly: Parallelize(Scope = ExecutionScope.MethodLevel)]

 public class MsTestProvider : ITestFrameworkProvider
    {
        public Type TestMethodAttributeType => typeof (TestMethodAttribute);

        public Exception GetFailedException(string message)
        {
            return new AssertFailedException(message);
        }

        public Exception GetInconclusiveException(string message)
        {
            return new AssertInconclusiveException(message);
        }
    }