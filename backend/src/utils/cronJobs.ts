import cron from "node-cron";
import User from "../models/User";

// ⏱ Runs every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running cleanup job...");

  try {
    await User.deleteMany({
      isVerified: false,
      verificationTokenExpires: { $lt: new Date() },
    });

    console.log("Deleted expired unverified users");

  } catch (err) {
    console.error("Cleanup error:", err);
  }
});