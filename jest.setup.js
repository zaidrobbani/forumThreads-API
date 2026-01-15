// Load config before all tests
import "./src/Commons/config.js";

// Make jest globals available in ES modules
import { jest } from "@jest/globals";
global.jest = jest;
