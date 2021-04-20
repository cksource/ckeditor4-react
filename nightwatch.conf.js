/* eslint-env node */

const bsUser = process.env.BROWSER_STACK_USERNAME;
const bsKey = process.env.BROWSER_STACK_ACCESS_KEY;
const bsBrowser = process.env.BROWSER_STACK_BROWSER;
const bsBuildName = process.env.BROWSER_STACK_BUILD_NAME;

const browsers = {
	chrome: {
		os: 'Windows',
		os_version: '10'
	},
	edge: {
		os: 'Windows',
		os_version: '10'
	},
	firefox: {
		os: 'Windows',
		os_version: '10'
	},
	ie: {
		os: 'Windows',
		os_version: '10'
	},
	safari: {
		os: 'OS X',
		os_version: 'Catalina'
	}
};

const nightwatchConfig = {
	selenium: {
		start_process: false,
		host: 'hub-cloud.browserstack.com',
		port: 443
	},

	output_folder: '.tmp-e2e-output',

	test_settings: {
		default: {
			desiredCapabilities: {
				build: bsBuildName,
				'browserstack.user': bsUser,
				'browserstack.key': bsKey,
				'browserstack.debug': true,
				'browserstack.local': true,
				'browserstack.console': 'errors',
				browser: bsBrowser,
				version: 'latest',
				...browsers[ bsBrowser ]
			}
		}
	}
};

// Code to copy seleniumhost/port into test settings
for ( const i in nightwatchConfig.test_settings ) {
	const config = nightwatchConfig.test_settings[ i ];
	config.selenium_host = nightwatchConfig.selenium.host;
	config.selenium_port = nightwatchConfig.selenium.port;
}

module.exports = nightwatchConfig;
