import { expectType } from 'tsd'
import fastify, {
  FastifyLogFn,
  LogLevel,
  FastifyLoggerInstance,
  FastifyRequest,
  FastifyReply,
  FastifyBaseLogger
} from '../../fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as fs from 'fs'
import P from 'pino'

expectType<FastifyLoggerInstance>(fastify().log)

class Foo {}

['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(logLevel => {
  expectType<FastifyLogFn>(fastify<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>().log[logLevel as LogLevel])
  expectType<void>(fastify<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>().log[logLevel as LogLevel](''))
  expectType<void>(fastify<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>().log[logLevel as LogLevel]({}))
  expectType<void>(fastify<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>().log[logLevel as LogLevel]({ foo: 'bar' }))
  expectType<void>(fastify<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>().log[logLevel as LogLevel](new Error()))
  expectType<void>(fastify<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>().log[logLevel as LogLevel](new Foo()))
})

/*
// TODO make pino export BaseLogger again
interface CustomLogger extends FastifyBaseLogger {
  customMethod(msg: string, ...args: unknown[]): void;
}

//   // ToDo https://github.com/pinojs/pino/issues/1100
class CustomLoggerImpl implements CustomLogger {
  level = 'info'
  customMethod (msg: string, ...args: unknown[]) { console.log(msg, args) }

  // Implementation signature must be compatible with all overloads of FastifyLogFn
  info (arg1: unknown, arg2?: unknown, ...args: unknown[]): void {
    console.log(arg1, arg2, ...args)
  }

  warn (...args: unknown[]) { console.log(args) }
  error (...args: unknown[]) { console.log(args) }
  fatal (...args: unknown[]) { console.log(args) }
  trace (...args: unknown[]) { console.log(args) }
  debug (...args: unknown[]) { console.log(args) }
  silent (...args: unknown[]) { }

  child (bindings: P.Bindings, options?: P.ChildLoggerOptions): CustomLoggerImpl { return new CustomLoggerImpl() }
}

const customLogger = new CustomLoggerImpl()

const serverWithCustomLogger = fastify<
Server,
IncomingMessage,
ServerResponse,
CustomLoggerImpl
>({ logger: customLogger })

expectType<CustomLoggerImpl>(serverWithCustomLogger.log)
*/

const serverWithPino = fastify<
Server,
IncomingMessage,
ServerResponse,
P.Logger
>({
  logger: P({
    level: 'info',
    redact: ['x-userinfo']
  })
})

expectType<P.Logger>(serverWithPino.log)

const serverWithLogOptions = fastify<
Server,
IncomingMessage,
ServerResponse
>({
  logger: {
    level: 'info'
  }
})

expectType<FastifyLoggerInstance>(serverWithLogOptions.log)

const serverWithFileOption = fastify<
Server,
IncomingMessage,
ServerResponse
>({
  logger: {
    level: 'info',
    file: '/path/to/file'
  }
})

expectType<FastifyLoggerInstance>(serverWithFileOption.log)

const serverAutoInferringTypes = fastify({
  logger: {
    level: 'info'
  }
})

expectType<FastifyBaseLogger>(serverAutoInferringTypes.log)

const serverWithAutoInferredPino = fastify({
  logger: P({
    level: 'info',
    redact: ['x-userinfo']
  })
})

expectType<P.Logger>(serverWithAutoInferredPino.log)

const serverAutoInferredFileOption = fastify({
  logger: {
    level: 'info',
    file: '/path/to/file'
  }
})

expectType<FastifyBaseLogger>(serverAutoInferredFileOption.log)

const serverAutoInferredPinoPrettyBooleanOption = fastify({
  logger: {
    prettyPrint: true
  }
})

expectType<FastifyBaseLogger>(serverAutoInferredPinoPrettyBooleanOption.log)

const serverAutoInferredPinoPrettyObjectOption = fastify({
  logger: {
    prettyPrint: {
      translateTime: true,
      levelFirst: false,
      messageKey: 'msg',
      timestampKey: 'time',
      messageFormat: false,
      colorize: true,
      crlf: false,
      errorLikeObjectKeys: ['err', 'error'],
      errorProps: '',
      search: 'foo == `bar`',
      ignore: 'pid,hostname',
      suppressFlushSyncWarning: true
    }
  }
})

expectType<FastifyBaseLogger>(serverAutoInferredPinoPrettyObjectOption.log)

const serverAutoInferredSerializerObjectOption = fastify({
  logger: {
    serializers: {
      req (IncomingMessage) {
        expectType<FastifyRequest>(IncomingMessage)
        return {
          method: 'method',
          url: 'url',
          version: 'version',
          hostname: 'hostname',
          remoteAddress: 'remoteAddress',
          remotePort: 80,
          other: ''
        }
      },
      res (ServerResponse) {
        expectType<FastifyReply>(ServerResponse)
        return {
          statusCode: 'statusCode'
        }
      },
      err (FastifyError) {
        return {
          other: '',
          type: 'type',
          message: 'msg',
          stack: 'stack'
        }
      }
    }
  }
})

expectType<FastifyBaseLogger>(serverAutoInferredSerializerObjectOption.log)

const passStreamAsOption = fastify({
  logger: {
    stream: fs.createWriteStream('/tmp/stream.out')
  }
})

expectType<FastifyBaseLogger>(passStreamAsOption.log)

const passPinoOption = fastify({
  logger: {
    redact: ['custom'],
    messageKey: 'msg',
    nestedKey: 'nested',
    prettyPrint: {

    },
    enabled: true
  }
})

expectType<FastifyBaseLogger>(passPinoOption.log)
