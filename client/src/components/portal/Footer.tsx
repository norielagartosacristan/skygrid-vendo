export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                &copy; {new Date().getFullYear()} Powered by BayanNet Telecom Corporation. All rights reserved.
            </div>
        </footer>
    );
}