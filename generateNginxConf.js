import fs from "fs/promises";
import path from "path";

// Get command-line arguments
const [, , domain, template] = process.argv;

if (!domain || !template) {
  console.error("Usage: node generateNginxConf.js <domain> <template>");
  process.exit(1);
}

// Define the paths for Nginx configuration directories
const SITES_AVAILABLE_DIR = "/etc/nginx/sites-available";
const SITES_ENABLED_DIR = "/etc/nginx/sites-enabled";
const TEMPLATE_DIST_DIR = `/var/www/${template}/dist/`;

// Template function to generate Nginx configuration for HTTPS
const httpsConfigTemplate = (domain) => `
server {
    listen 80;
    listen [::]:80;
    server_name ${domain} www.${domain};
    root /var/www/${domain}/dist;
}
`;

const createConfigFile = async (domain) => {
  try {
    const configContent = httpsConfigTemplate(domain);
    const configFilePath = path.join(SITES_AVAILABLE_DIR, domain);
    await fs.writeFile(configFilePath, configContent, "utf8");
    console.log(`Created Nginx config for ${domain}`);
    return configFilePath;
  } catch (err) {
    console.error(`Error creating config file for ${domain}:`, err.message);
    throw err;
  }
};

const createSymlink = async (source, target) => {
  try {
    await fs.symlink(source, target);
    console.log(`Created symlink: ${target}`);
  } catch (err) {
    if (err.code === "EEXIST") {
      console.log(`Symlink already exists: ${target}`);
    } else {
      console.error(`Error creating symlink: ${err.message}`);
      throw err;
    }
  }
};

const createWebsiteDirectory = async (domain) => {
  try {
    const websiteDir = path.join("/var/www", domain);
    await fs.mkdir(websiteDir, { recursive: true });
    console.log(`Created directory for ${domain}`);
    return websiteDir;
  } catch (err) {
    console.error(`Error creating directory for ${domain}:`, err.message);
    throw err;
  }
};

const createDistSymlink = async (domain) => {
  try {
    const distDir = path.join("/var/www", domain, "dist");
    
    try {
      await fs.unlink(distDir); // Remove existing dist directory or symlink
    } catch (err) {
      if (err.code !== 'ENOENT') { // Ignore error if dist does not exist
        throw err;
      }
    }

    await createSymlink(TEMPLATE_DIST_DIR, distDir);
  } catch (err) {
    console.error(`Error creating dist symlink for ${domain}:`, err.message);
    throw err;
  }
};

const createNginxConfigurations = async () => {
  try {
    const configFilePath = await createConfigFile(domain);
    const symlinkPath = path.join(SITES_ENABLED_DIR, domain);
    await createSymlink(configFilePath, symlinkPath);
    await createWebsiteDirectory(domain);
    await createDistSymlink(domain);
    console.log("All configurations have been created and enabled.");
  } catch (err) {
    console.error("Error creating Nginx configurations:", err.message);
  }
};

createNginxConfigurations();
