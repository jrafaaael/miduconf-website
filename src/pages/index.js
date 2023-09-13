import { Inter, Inter_Tight as InterTight } from 'next/font/google'
import Head from 'next/head'

import { Background } from '@/components/Background'
import { Speakers } from '@/components/Speakers'
import { Sponsors } from '@/sections/sponsors'
import { HeaderIndex } from '@/components/HeaderIndex'
import { HeaderCountdown } from '@/components/HeaderCountdown'
import { Meteors } from '@/components/MeteorLanguages'
import { TicketHome } from '@/sections/ticket-home'
import { Gifts } from '@/sections/gifts'
import { Agenda } from '@/sections/agenda'
import { Live } from '@/sections/live'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export const inter = Inter({ weight: ['400', '500', '600', '700', '900'], subsets: ['latin'] })
export const interTight = InterTight({ weight: ['500', '800', '900'], subsets: ['latin'] })

const PREFIX_CDN = 'https://ljizvfycxyxnupniyyxb.supabase.co/storage/v1/object/public/tickets'

const title = 'miduConf - La conferencia de programación y desarrollo'
const description =
	'Conferencia de programación y tecnología para el día del programador y la programadora'
const defaultOgImage = '/og-image.jpg'
const url = 'https://miduconf.com'

export default function Home({ username, flavor, ticketNumber, burst }) {
	const ogImage = username
		? `${PREFIX_CDN}/ticket-${ticketNumber}.jpg?c=${burst}`
		: `${url}${defaultOgImage}`

	return (
		<>
			<Head>
				<title>miduConf - La conferencia de programación y desarrollo</title>
				<meta name='description' content={description} />
				<meta property='og:image' content={ogImage} />
				<meta property='twitter:image' content={ogImage} />
				<meta property='og:title' content={title} />
				<meta property='twitter:title' content={title} />
				<meta property='og:description' content={description} />
				<meta property='twitter:description' content={description} />
				<meta property='og:url' content={url} />
				<meta property='twitter:url' content={url} />
				<meta property='og:type' content='website' />
				<meta property='twitter:card' content='summary_large_image' />
				<link rel='icon' href='/favicon.svg' />
			</Head>

			<Meteors />
			<Background />

			<header id='header' className='relative w-full mb-10 overflow-hidden z-[99999]'>
				<HeaderCountdown />
			</header>

			<HeaderIndex />

			<main className={`${inter.className} max-w-5xl m-auto mt-16 pb-20 px-4`}>
				<Live />
				<TicketHome ticketNumber={ticketNumber} initialFlavor={flavor} username={username} />
				<Speakers />
				<Sponsors />
				<Gifts />
				<Agenda />
			</main>
		</>
	)
}

export const getServerSideProps = async (ctx) => {
	// read query parameter
	const { ticket } = ctx.query
	// create supabase client
	const supabase = createPagesServerClient(ctx)
	// if no ticket, return empty props
	if (!ticket) {
		return {
			props: {}
		}
	}

	// search ticket for user
	const { data, error } = await supabase.from('ticket').select('*').eq('user_name', ticket)
	// check if we have results
	if (data.length > 0 && !error) {
		return {
			props: {
				burst: crypto.randomUUID(),
				ticketNumber: data[0].ticket_number,
				username: data[0].user_name,
				flavor: data[0].flavour
			}
		}
	}

	return {
		props: {}
	}
}
