import "dotenv/config";
import { autoProvision } from "./services/networkProvision.service";

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`🚀 Server running on ${PORT}`);

    await autoProvision();
});