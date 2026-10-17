using System;
using DataverseUnitTest;
using System.Diagnostics;
namespace VoyageVistaSales.Plugins.Tests;

public class DebugLogger: ITestLogger
    {
        public void WriteLine(string message)
        {
            Debug.WriteLine(message);
        }

        public void WriteLine(string format, params object[] args)
        {
            Debug.WriteLine(format, args);
        }
    }
