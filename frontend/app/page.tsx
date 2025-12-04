import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex">
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <span className="font-bold text-xl">AfroBeats</span>
                        </Link>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <ModeToggle />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 pb-8 pt-6 md:py-10">
                    <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
                        <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
                            AfroBeats Royalty Protocol
                        </h1>
                        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
                            Decentralized IP registry and royalty distribution platform for Afrobeats artists.
                            Built on Camp Network with AI-powered plagiarism detection.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button asChild size="lg" className="h-11 px-8">
                                <Link href="/dashboard">
                                    Launch App
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-11 px-8">
                                <Link href="https://github.com/developeenthustiast/Afrobeats" target="_blank">
                                    View on GitHub
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-16">
                        <FeatureCard
                            title="IP-NFT Registry"
                            description="Register your music as on-chain intellectual property NFTs with ERC-6551 token-bound accounts"
                        />
                        <FeatureCard
                            title="AI Plagiarism Detection"
                            description="Audio fingerprinting and similarity checking using machine learning and vector databases"
                        />
                        <FeatureCard
                            title="Automated Royalties"
                            description="Smart contract-based streaming revenue distribution with real-time oracle data"
                        />
                        <FeatureCard
                            title="IP-Fi Lending"
                            description="Borrow against future royalty streams with decentralized lending pools"
                        />
                        <FeatureCard
                            title="IPFS Storage"
                            description="Decentralized storage for audio files and metadata via Origin SDK and Pinata"
                        />
                        <FeatureCard
                            title="Gasless Onboarding"
                            description="Meta-transactions enable frictionless user experience without gas fees"
                        />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built with ❤️ for the Afrobeats community
                    </p>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}
