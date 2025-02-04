#!/usr/bin/env node

import { parse } from './parse';
import { IWriteMarkDown } from './contracts';
import { resolve, relative } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { addContent, generateUsageGuides } from './helpers';
import { argumentConfig, parseOptions } from './write-markdown.constants';
import format from 'string-format';
import chalk from 'chalk';

function writeMarkdown() {
    const args = parse<IWriteMarkDown>(argumentConfig, parseOptions);

    const markdownPath = resolve(args.markdownPath);

    console.log(`Loading existing file from '${markdownPath}'`);
    const markdownFileContent = readFileSync(markdownPath).toString();

    const usageGuides = generateUsageGuides(args);
    const modifiedFileContent = addContent(markdownFileContent, usageGuides, args);

    const action = args.verify === true ? `verify` : `write`;
    const contentMatch = markdownFileContent === modifiedFileContent ? `match` : `nonMatch`;

    const relativePath = relative(process.cwd(), markdownPath);

    switch (`${action}_${contentMatch}`) {
        case 'verify_match':
            console.log(chalk.green(`'${relativePath}' content as expected. No update required.`));
            break;
        case 'verify_nonMatch':
            console.warn(
                chalk.yellow(
                    format(args.verifyMessage || `'{relativePath}' file out of date. Rerun write-markdown to update.`, {
                        fileName: relativePath,
                    }),
                ),
            );
            return process.exit(1);
        case 'write_match':
            console.log(chalk.blue(`'${relativePath}' content not modified, not writing to file.`));
            break;
        case 'write_nonMatch':
            console.log(chalk.green(`Writing file to '${relativePath}'`));
            writeFileSync(relativePath, modifiedFileContent);
            break;
    }
}

writeMarkdown();
