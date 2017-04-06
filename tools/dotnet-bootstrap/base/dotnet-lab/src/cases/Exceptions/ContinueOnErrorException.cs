using System;

namespace Lab.Exceptions
{
    class ContinueOnErrorException : Exception
    {
    public ContinueOnErrorException()
    {
    }

    public ContinueOnErrorException(string message)
        : base(message)
    {
    }

    public ContinueOnErrorException(string message, Exception inner)
        : base(message, inner)
    {
    }
    }
}