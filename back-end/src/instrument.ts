// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from "@sentry/nestjs"

Sentry.init({
    dsn: "https://b7ee3275ed2b45e32504a5fb4cfba034@o4510840495996928.ingest.de.sentry.io/4510840508055632",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});