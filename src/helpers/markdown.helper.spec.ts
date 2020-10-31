/* eslint-disable no-useless-escape */
import {
    usageGuideInfo as exampleConfigGuideInfo,
    ICopyFilesArguments,
    typicalAppWithGroupsInfo,
    exampleSections,
} from '../example/configs';
import { usageGuideInfo as writeMarkdownGuideInfo } from '../write-markdown.constants';
import { createUsageGuide } from './markdown.helper';
import { UsageGuideConfig } from '../contracts';

describe('markdown-helper', () => {
    it('should generate a simple usage guide with no additional sections and no alias column', () => {
        const info: UsageGuideConfig<ICopyFilesArguments> = {
            arguments: { ...exampleConfigGuideInfo.arguments, copyFiles: Boolean },
        };

        const usageGuide = createUsageGuide(info);

        expect(usageGuide).toEqual(`
## Options

| Argument | Type |
|-|-|
| **sourcePath** | string |
| **targetPath** | string |
| **copyFiles** | boolean |
| **resetPermissions** | boolean |
| **filter** | string |
| **excludePaths** | string[] |
`);
    });

    it('should generate a simple usage guide with no additional sections', () => {
        const usageGuide = createUsageGuide(exampleConfigGuideInfo);

        expect(usageGuide).toEqual(`
## Options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **sourcePath** | | string | |
| **targetPath** | | string | |
| **copyFiles** | **c** | **file[]** | **bold text** *italic text* ***bold italic text*** |
| **resetPermissions** | | boolean | |
| **filter** | | string | |
| **excludePaths** | | string[] | |
`);
    });

    it('should generate a usage guide with sections', () => {
        const usageGuide = createUsageGuide(writeMarkdownGuideInfo);

        expect(usageGuide).toEqual(`
## Markdown Generation

A markdown version of the usage guide can be generated and inserted into an existing markdown document.  
Markers in the document describe where the content should be inserted, existing content betweeen the markers is overwritten.



\`write-markdown -m README.MD -j usageGuideConstants.js\`


### write-markdown cli options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **markdownPath** | **m** | string | The file to write to. Without replacement markers the whole file content will be replaced. Path can be absolute or relative. |
| **replaceBelow** | | string | A marker in the file to replace text below. |
| **replaceAbove** | | string | A marker in the file to replace text above. |
| **jsFile** | **j** | string[] | jsFile to 'require' that has an export with the 'ArgumentConfig' export. Multiple file can be specified. |
| **configImportName** | **c** | string[] | Export name of the 'ArgumentConfig' object. Defaults to 'usageGuideInfo'. Multiple exports can be specified. |
| **verify** | **v** | boolean | Verify the markdown file. Does not update the file but returns a non zero exit code if the markdown file is not correct. Useful for a pre-publish script. |
| **configFile** | **f** | string | Optional config file to load config from. package.json can be used if jsonPath specified as well |
| **jsonPath** | **p** | string | Used in conjunction with 'configFile'. The path within the config file to load the config from. For example: 'configs.writeMarkdown' |
| **verifyMessage** | | string | Optional message that is printed when markdown verification fails. Use '{fileName}' to refer to the file being processed. |
| **help** | **h** | boolean | Show this usage guide. |


### Default Replacement Markers

replaceBelow defaults to:  
  
\`\`\`  
'[//]: ####ts-command-line-args_write-markdown_replaceBelow  '  
\`\`\`  
  
replaceAbove defaults to:  
  
\`\`\`  
'[//]: ####ts-command-line-args_write-markdown_replaceAbove  '  
\`\`\`  
  
Note the double spaces at the end to signify to markdown that there should be a new line.


### String Formatting

The only chalk modifiers supported when converting to markdown are \`bold\` and \`italic\`.  
For example:  
  
\`\`\`  
{bold bold text} {italic italic text} {italic.bold bold italic text}  
\`\`\`  
  
will be converted to:  
  
\`\`\`  
**boldText** *italic text* ***bold italic text***  
\`\`\`  



### Additional Modifiers

Two additional style modifiers have been added that are supported when writing markdown. They are removed when printing to the console.  
  
\`\`\`  
{highlight someText}  
\`\`\`  
  
surrounds the text in backticks:  
\`someText\`  
and   
  
\`\`\`  
{code.typescript function(message: string)\\\\{console.log(message);\\\\}}  
\`\`\`  
  
Surrounds the text in triple back ticks (with an optional language specifer, in this case typescript):  
\`\`\`typescript  
function(message: string)\{console.log(message);\}  
\`\`\`
`);
    });

    it('should generate a usage guide with option groups', () => {
        const usageGuide = createUsageGuide(typicalAppWithGroupsInfo);

        expect(usageGuide).toEqual(`
# A typical app

Generates something *very* important.


## Main options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **help** | **h** | boolean | Display this usage guide. |
| **src** | | file ... | The input files to process |
| **timeout** | **t** | ms | Timeout value in ms |


## Misc

| Argument | Type | Description |
|-|-|-|
| **plugin** | string | A plugin path |
`);
    });

    it('should generate a usage guide with table of examples', () => {
        const usageGuide = createUsageGuide(exampleSections);

        expect(usageGuide).toEqual(`
# A typical app

Generates something *very* important.


# both




# markdown




# Synopsis

$ example [**--timeout** ms] **--src** file ...
$ example **--help**


## Options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **help** | **h** | boolean | Display this usage guide. |
| **src** | | file ... | The input files to process |
| **timeout** | **t** | ms | Timeout value in ms |
| **plugin** | | string | A plugin path |


# Examples


| Description | Example |
|-|-|
| 1. A concise example.  | $ example -t 100 lib/*.js |
| 2. A long example.  | $ example --timeout 100 --src lib/*.js |
| 3. This example will scan space for unknown things. Take cure when scanning space, it could take some time.  | $ example --src galaxy1.facts galaxy1.facts galaxy2.facts galaxy3.facts galaxy4.facts galaxy5.facts |


# both




# markdown





Project home: https://github.com/me/example
`);
    });

    it('should generate a usage guide with json example', () => {
        const typicalAppWithJSON: UsageGuideConfig<Record<string, string>> = {
            arguments: {},
            parseOptions: {
                headerContentSections: [
                    {
                        header: 'A typical app',
                        content: `Generates something {italic very} important.
Some Json:

{code.json
\\{
    "dependencies": \\{
        "someDependency: "0.2.1",
    \\},
    "peerDependencies": \\{
        "someDependency: "0.2.1",
    \\}
\\}
}`,
                    },
                ],
            },
        };
        const usageGuide = createUsageGuide(typicalAppWithJSON);

        expect(usageGuide).toEqual(`
# A typical app

Generates something *very* important.  
Some Json:  
  
  
\`\`\`json  
{  
    "dependencies": {  
        "someDependency: "0.2.1",  
    },  
    "peerDependencies": {  
        "someDependency: "0.2.1",  
    }  
}  
  
\`\`\`  

`);
    });
});
