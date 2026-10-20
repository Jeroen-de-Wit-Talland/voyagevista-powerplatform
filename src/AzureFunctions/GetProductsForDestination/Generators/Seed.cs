using System;
using System.Security.Cryptography;
using System.Text;

namespace VoyageVistaSales.Azure.Functions.Generators;

public static class Seed
{
    public static int From(string destination, string scope)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes($"{scope}:{destination.Trim().ToLowerInvariant()}"));
        return BitConverter.ToInt32(bytes, 0);
    }
}