import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Metaverse Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <span className="mr-4 text-pink-500 cursor-pointer">
              Home
            </span>
          </Link>
          <Link href="/create-nft">
            <span className="mr-6 text-pink-500 cursor-pointer">
              Sell NFT
            </span>
          </Link>
          <Link href="/my-nfts">
            <span className="mr-6 text-pink-500 cursor-pointer">
              My NFTs
            </span>
          </Link>
          <Link href="/dashboard">
            <span className="mr-6 text-pink-500 cursor-pointer">
              Dashboard
            </span>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp