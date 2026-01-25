
import { spawn } from 'child_process';
import readline from 'readline';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ASCII_ART = `
██████╗  █████╗ ████████╗ █████╗ ███████╗ ██████╗ ██████╗ ██╗   ██╗████████╗
██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔════╝██╔════╝██╔═══██╗██║   ██║╚══██╔══╝
██║  ██║███████║   ██║   ███████║███████╗██║     ██║   ██║██║   ██║   ██║   
██║  ██║██╔══██║   ██║   ██╔══██║╚════██║██║     ██║   ██║██║   ██║   ██║   
██████╔╝██║  ██║   ██║   ██║  ██║███████║╚██████╗╚██████╔╝╚██████╔╝   ██║   
╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝    ╚═╝   
`;

const COLORS = {
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    white: '\x1b[37m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
    reset: '\x1b[0m',
    clear: '\x1b[2J\x1b[H'
};

async function animateLoading(text, duration = 2000) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const startTime = Date.now();

    while (Date.now() - startTime < duration) {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${COLORS.cyan}${frames[i % frames.length]}${COLORS.reset} ${COLORS.bold}${text}${COLORS.reset}`);
        i++;
        await sleep(100);
    }
    process.stdout.write('\n');
}

async function showProgressBar(text, duration = 1500) {
    const width = 30;
    const startTime = Date.now();

    while (true) {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const filled = Math.floor(progress * width);
        const empty = width - filled;

        readline.cursorTo(process.stdout, 0);
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        process.stdout.write(`${COLORS.dim}[${COLORS.reset}${COLORS.cyan}${bar}${COLORS.dim}]${COLORS.reset} ${COLORS.bold}${text}${COLORS.reset} ${Math.floor(progress * 100)}%`);

        if (progress >= 1) break;
        await sleep(50);
    }
    process.stdout.write('\n');
}

async function start() {
    process.stdout.write(COLORS.clear);

    // Animation 1: ASCII Reveal with glitch effect
    const lines = ASCII_ART.split('\n');
    for (const line of lines) {
        process.stdout.write(`${COLORS.cyan}${line}${COLORS.reset}\n`);
        await sleep(50);
    }

    console.log(`\n${COLORS.bold}${COLORS.white}--- SYSTEM INITIALIZATION ---${COLORS.reset}\n`);

    await animateLoading('CONNECTING TO NEURAL CORE...');
    await showProgressBar('LOADING AGENT PROTOCOLS');
    await animateLoading('SYNCHRONIZING WITH GEMINI 2.5 FLASH...');
    await showProgressBar('INITIALIZING DATASTREAM');

    console.log(`\n${COLORS.green}${COLORS.bold}✔ SYSTEM READY. DEPLOYING INTERFACE...${COLORS.reset}\n`);
    await sleep(500);

    // Launch Vite
    const vite = spawn('npx', ['vite'], {
        stdio: 'inherit',
        shell: true
    });

    vite.on('error', (err) => {
        console.error(`${COLORS.red}Failed to start Vite: ${err.message}${COLORS.reset}`);
    });
}

start();
