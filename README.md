# Fork the Bill

Fork the Bill is an application designed to facilitate splitting restaurant bills among multiple people. It allows users to upload receipts for automatic item extraction, share bills via QR codes and link, claim items and view total amount owed.

🚀 **Application is live at:** [forkthebill.vercel.app](https://forkthebill.vercel.app)


⚙️ **Backend Repository:** [github.com/thameenas/fork-the-bill-service](https://github.com/thameenas/fork-the-bill-service)

## Features

- **Receipt Upload**: Upload restaurant receipts and automatically extract items.
- **Bill Splitting**: Easily split bills among multiple people.
- **Real-time Updates**: See changes instantly as others claim items.
- **QR Code Sharing**: Share bills easily via QR codes.
- **Mobile Optimized**: Fully responsive design for use on any device.

## Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fork-the-bill-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file. Configure your API URL (default is `http://localhost:8080`).
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser.