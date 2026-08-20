const { ImapFlow } = require('imapflow')
const { simpleParser } = require('mailparser')
const cheerio = require('cheerio')

const POLL_INTERVAL_MS = 3000
const MAX_WAIT_MS = 60000
const VERIFY_LINK_TEXT = 'Verify Your Account'

async function findVerificationLink({ toAlias, sinceMs }, config) {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: config.env.gmail_test_email_base,
      pass: config.env.gmail_test_app_password,
    },
    logger: false,
  })

  const deadline = Date.now() + MAX_WAIT_MS

  try {
    await client.connect()
    const lock = await client.getMailboxLock('INBOX')
    try {
      while (Date.now() < deadline) {
        const uids = await client.search({ gmailRaw: `to:"${toAlias}"` }, { uid: true })

        for (const uid of (uids || []).sort((a, b) => b - a)) {
          const message = await client.fetchOne(uid, { source: true, envelope: true }, { uid: true })
          if (new Date(message.envelope.date).getTime() < sinceMs) continue

          const parsed = await simpleParser(message.source)
          const $ = cheerio.load(parsed.html || parsed.textAsHtml || '')
          const link = $('a')
            .filter((_, el) => $(el).text().trim() === VERIFY_LINK_TEXT)
            .attr('href')
          if (link) return link
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
      }
    } finally {
      lock.release()
    }
  } catch (err) {
    // imapflow's own message is just "Command failed" — the real reason from
    // the server (auth failure, IMAP disabled, etc.) lives in responseText.
    if (err.responseText) {
      err.message = `${err.message} — ${err.responseStatus}: ${err.responseText}`
    }
    throw err
  } finally {
    await client.logout().catch(() => {})
  }

  throw new Error(`Verification email to ${toAlias} not found within ${MAX_WAIT_MS}ms`)
}

module.exports = function registerGmailTasks(on, config) {
  on('task', {
    'gmail:findVerificationLink': (args) => findVerificationLink(args, config),
  })
}
