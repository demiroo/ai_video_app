module.exports = {
  async rewrites() {
    return [
      {
        source: '/quiz/:path*',
        destination: 'http://localhost:3000/quiz/:path*',
      },
    ]
  },
}
