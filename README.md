
<img src="https://dicechampionship.s3-eu-west-1.amazonaws.com/diceChampionship_title_live.png">

The Dice Championship project is about exploring how a simple voice app - Dice Championship - can be implemented and extended using different frameworks, platforms and services. It was initiated and published by me (<a href="https://twitter.com/FlorianHollandt">Florian Hollandt</a>), but contributions of ideas, implementations and improvements are very welcome. :)

## What is this repository about?
This is the implementation of Dice Championship that got published to the <a href="https://www.amazon.com/dp/B07V41F2LK">US</a>, <a href="https://www.amazon.ca/dp/B07V41F2LK">(english) Canadian</a> and <a href="https://www.amazon.de/dp/B07V41F2LK">German</a> Alexa Skill Store, and it contains the complete set of features to elevate the Skill from the <a href="https://github.com/FlorianHollandt/diceChampionship-dynamoDb">simplified, easy-to-follow base version</a> to a something that evidently passed certification.

Here are the differences in detail:<br/>
<table>
    <tr>
        <td>
            &nbsp;
        </td>
        <th>
            <a href="https://github.com/FlorianHollandt/diceChampionship-dynamoDb">Base version</a>
        </th>
        <th>
            Live Alexa Skill version
        </th>
    </tr>
    <tr>
        <th>
            Persistence
        </th>
        <td>
            Only within sessions
        </td>
        <td>
            Between sessions, using a separate DynamoDB table for user data
        </td>
    </tr>
    <tr>
        <th>
            Returning users
        </th>
        <td>
            Treated as new users, i.e. no functionality covering returning users
        </td>
        <td>
            Proper treatment of returning users, i.e. greeting and summary
        </td>
    </tr>
    <tr>
        <th>
            Help intent
        </th>
        <td>
            Not handled
        </td>
        <td>
            Handler with different behavior for launch and within-session help request
        </td>
    </tr>
    <tr>
        <th>
            Round counter
        </th>
        <td>
            Not implemented
        </td>
        <td>
            Implemented (number of rounds within session and in total)
        </td>
    </tr>
    <tr>
        <th>
            Leaderboard
        </th>
        <td>
            Contains attributes <code>id</code> and <code>score</code>
        </td>
        <td>
            Contains more attributes (<code>platform</code>, <code>locale</code>, <code>rounds</code> &amp; <code>userStatus</code> and <code>date</code>)
        </td>
    </tr>
    <tr>
        <th>
            Regional availability
        </th>
        <td>
            Only <code>en-US</code> :us:
        </td>
        <td>
            <code>en-US</code> :us:, <code>en-CA</code> :maple_leaf:, <code>de-DE</code> :de:
        </td>
    </tr>
    <tr>
        <th>
            Sounds
        </th>
        <td>
            Game show sounds from <a href="https://developer.amazon.com/docs/custom-skills/ask-soundlibrary.html">ASK Sound Library</a>
        </td>
        <td>
            Licensed and remixed sounds from <a href="https://audiojungle.net">Audiojungle</a>
        </td>
    </tr>
</table>

Ultimately, this version of Dice Championship will combine the most publication-worthy features of all implementations within this project.

## Sound effects

This version uses different, and thus less generic sound effects than the base version. It might be educational to have a bit of background on where these sound effects were obtained (short answer: <a href="https://audiojunge.net">Audiojungle</a>) and how they were selected.

<table>
    <tr>
        <th>
            &nbsp;
        </th>
        <th>
            <a href="https://github.com/FlorianHollandt/diceChampionship-dynamoDb">Base version</a>
        </th>
        <th>
            Live Alexa Skill version
        </th>
    </tr>
    <tr>
        <td>
            Welcome / intro sound
        </td>
        <td>
            "Gameshow Intro (1)" ("Gameshow" category)
        </td>
        <td>
            <a href="https://audiojungle.net/item/victory/8145193">"Victory"</a> <code>*</code>
        </td>
    </tr>
    <tr>
        <td>
            Goodbye / outro sound
        </td>
        <td>
            "Gameshow Outro (1)" ("Gameshow" category)
        </td>
        <td>
            <a href="https://audiojungle.net/item/small-success/9934851">"Small Success"</a> <code>*</code>
        </td>
    </tr>
    <tr>
        <td>
            Dice sound
        </td>
        <td>
            "Board Games (8)" ("Toys_Games/Board_Games" category)
        </td>
        <td>
            <a href="https://audiojungle.net/item/playing-dice-rolling-6-variations/233027">"Playing Dice - Rolling (6 variations)"</a>
        </td>
    </tr>
    <tr>
        <td>
            Tally with positive result
        </td>
        <td>
            "Gameshow Tally Positive (1)" ("Gameshow" category)
        </td>
        <td>
            <a href="https://audiojungle.net/item/game-points-count-rapid/19154239">"Game Points Count Rapid"</a> +
            <a href="https://audiojungle.net/item/small-success/9934851">"Small Success"</a> <code>*</code>
        </td>
    </tr>
    <tr>
        <td>
            Tally with negative result
        </td>
        <td>
            "Gameshow Tally Negative (1)" ("Gameshow" category)
        </td>
        <td>
            <a href="https://audiojungle.net/item/game-points-count-rapid/19154239">"Game Points Count Rapid"</a> (shorter version) +
            <a href="https://audiojungle.net/item/soft-fail/9094400">"Soft Fail"</a> <code>*</code>
        </td>
    </tr>
    <tr>
        <td>
            Minor success (new personal highscore)
        </td>
        <td>
            "Gameshow Positive Response (1)" ("Gameshow" category)
        </td>
        <td>
            <a href="https://audiojungle.net/item/victory/8145193">"Victory"</a> <code>*</code>
        </td>
    </tr>
    <tr>
        <td>
            Medium success (Higher rank)
        </td>
        <td>
            "Gameshow Positive Response (2)" ("Gameshow" category)
        </td>
        <td>
            <a href="https://audiojungle.net/item/victory/8145193">"Victory"</a> <code>*</code>
        </td>
    </tr>
    <tr>
        <td>
            Major success (First rank!)
        </td>
        <td>
            "Gameshow Positive Response (3)" ("Gameshow" category)
        </td>
        <td>
            <a href="https://audiojungle.net/item/win-fanfare/9432605">"Win Fanfare"</a> <code>*</code>
        </td>
    </tr>
</table>

All audio files marked with <code>*</code> were produced by <a href="https://audiojungle.net/user/gamechestaudio">the same Audiojungle user</a>, to ensure a consistent audio experience across the Skill. The tally and dice sounds were mixed using GarageBand.

I have purchase a single-use license for the Audiojungle sounds mentioned here, so if you plan to use these sounds in your own voice apps, you will need to purchase your own license.

# Setting up the Live Alexa Skill version

**Disclaimer:** The following setup instruction is copied from the base version, because the only difference is that you need a slightly different IAM policy, and another environment variable for the user database.


1. **Setting up the project folder**
   - Clone this repository, run `npm install --save` and make a copy of `.env.example` named `.env`. We'll use environment variables to set up all the required credentials.<br/>
   - You can already make a decision about your database table names for scores and users (let's say `diceChampionship_scores` and `diceChamptionship_users`) and favorite AWS region (e.g. Ireland/`eu-west-1`) for the steps and services described below, and include them in your `.env` file like this: `DYNAMODB_REGION='eu-west-1'`, `DYNAMODB_TABLE_NAME_SCORES='diceChamptionship_scores'` and `DYNAMODB_TABLE_NAME_USERS='diceChamptionship_users'`
2. **Setting up access to your DynamoDB table**
   - Depending on whether you want to run the Skill locally or on Lambda, you need either a **programmatic user** (aka serivce account) a **role** with access to both your new cluster and its credentials secret. To cover both, start out by creating a new <a href="https://console.aws.amazon.com/iam/home?#/policies">AWS IAM policy</a> 'diceChampionship_policy' using the one from `policy.json` in this repo.
   - Change the resource ARN for the first group in line 14 if you chose a different table name in **step 1**.
   - Create a new <a href="https://console.aws.amazon.com/iam/home?#/users">AWS IAM user</a> 'diceChampionship_user' with programmatic access and the policy 'diceChampionship_policy' you just created. Instead of downloading the credentials file, you can directly **copy the access key ID and secret access key** into your `.env` file as `DYNAMODB_ACCESS_KEY_ID='<your-access-key-id>'`and `DYNAMODB_SECRET_ACCESS_KEY='<your-secret-access-key>'`.
   - Simliarly, create a new <a href="https://console.aws.amazon.com/iam/home?#/roles">AWS IAM role</a> `diceChampionship_role`, again with the 'diceChampionship_policy' policy from above. It already has write access to CloudWatch logs, so you know what's going on on your Lambda.
3. **Creating your DynamoDB score table**
   - For your convenience, I provided a **setup script** `setup.js` in this repo that uses the config and credentials from your `.env` file along with the table config from `src/config.js` to create the required table.
   - The table will be set up with a reserved **read and write capacity** of 1 each, because that's what's eligible for the AWS free tier. If you prefer 'on-demand' scaling and billing, choose 'pay-per-request' as your billing mode.
   - To execute this script, run `node setup.js` from your command line. It will check which DynamoDB tables exist in your region, and **create a new table** with the name of `DYNAMODB_TABLE_NAME` from your `.env` file ('diceChampionship' by default) if it doesn't
   - You don't need to set up the **DynamoDB user table** explicitly like that - the Jovo DynamoDB plugin will do this for you. However, it will set up the table with a read and write capacity of 5 each, which you might want to reduce to save costs
4. **Creating your Lambda function**
   - I didn't provide a setup script for your Lambda function, as this would have used an excessive amount of access privileges. However, setting up a Lambda function is a routine thing, so let's quickly walk through this!
   - Open the <a href="https://console.aws.amazon.com/lambda/home?#/functions">AWS Lambda functions overview</a> in your selected region and hit **Create function**.
   -  Give your Lambda a Node 8.10 runtime (or above) and the existing role 'diceChampionship_role' from **step 2**.
   -  Add **'Alexa Skills Kit' as a trigger** for your Lambda function. For now you can disable the restriction to a defined Skill ID.
   -  Copy the **environment variables** `DYNAMODB_TABLE_NAME_USERS`, `DYNAMODB_TABLE_NAME_SCORES` and their respective values from your local `.env` file to the Lambda's environment variable section.
   -  Copy the **Lambda's ARN** into your local `.env` file, as the value of `LAMBDA_ARN_STAGING` (more on staging below).
5. **Creating the Alexa Skill**
   - This is something you could do directly in the Alexa developer console, but here we're using the <a href="https://github.com/jovotech/jovo-cli">Jovo CLI</a> because it's super convenient. So be sure to have the Jovo CLI installed and optimally your <a href="https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html">ASK CLI and AWS CLI profiles set up</a>.
   - Write the name of the ASK CLI profile you plan to use into your local `.env` file as e.g. `ASK_PROFILE='default'`.
   - Now execute `jovo build -p alexaSkill --stage local --deploy` from your command line. This builds the Skill manifest (`platforms/alexaSkill/skill.json`) and language model (`platforms/alexaSkill/models/en-US.json`) from the information in the project configuration file (`project.js`) and the Jovo language model (`models/en-US.json`), and uses them to set up a new Skill 'Dice Tournament' in your Alexa developer console.<br/>
    The result should look like this:<br/>
    <img src="https://dicechampionship.s3-eu-west-1.amazonaws.com/diceChampionship_buildLocal_live.png" width="65%"><br/>
    - Now copy the Skill ID from the console output and paste it as the value of the `SKILL_ID_STAGING` variable in your `.env` file.
    - Execute `jovo run --watch` from your command line to **activate your local endpoint**. The Skill endpoint will create the DynamoDB user table.

## Congrats, you've already set up the Skill on your machine
You can already test your Skill in the Alexa developer console, or on your device by saying "Alexa, open Dice Tournament"!

The remaining steps are optional, but recommended. Before we proceed to uploading the Skill to Lambda, let me explain the staging setup.

1. **Reviewing the staging setup**
   - This project comes  with a setup for **three stages**, to propagate good practices and let you try out things both locally and on Lambda, because it might behave differently (e.g. in terms of latency)
    <table>
        <tr>
            <th>
                Name
            </th>
            <th>
                Description
            </th>
            <th>
                Environment <br/>
                + Endpoint
            </th>
            <th>
                Databases
            </th>
            <th>
                Skill ID
            </th>
            <th>
                Invocation name
            </th>
            <th>
                Skill icon
            </th>
        </tr>
        <tr>
            <td>
                local
            </td>
            <td>
                Local endpoint for rapid development + debugging
            </td>
            <td>
                <code>${JOVO_WEBHOOK_URL}</code>
            </td>
            <td>
                <code>DYNAMODB_TABLE_NAME_USERS</code>
                + <code>DYNAMODB_TABLE_NAME_SCORES</code>
            </td>
            <td>
                <code>SKILL_ID_STAGING</code>
            </td>
            <td>
                dice tournament
            </td>
            <td>
                <img src="https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChampionship_stage_small.png">
            </td>
        </tr>
        <tr>
            <td>
                staging
            </td>
            <td>
                Lambda endpoint for testing on a production-like environment
            </td>
            <td>
                <code>LAMBDA_ARN_STAGING</code>
            </td>
            <td>
                <code>DYNAMODB_TABLE_NAME_USERS</code>
                + <code>DYNAMODB_TABLE_NAME_SCORES</code>
            </td>
            <td>
                <code>SKILL_ID_STAGING</code>
            </td>
            <td>
                dice tournament
            </td>
            <td>
                <img src="https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChampionship_stage_small.png">
            </td>
        </tr>
        <tr>
            <td>
                live
            </td>
            <td>
                Lambda endpoint for fulfillment of the live Skill
            </td>
            <td>
                <code>LAMBDA_ARN_LIVE</code>
            </td>
            <td>
                <code>DYNAMODB_TABLE_NAME_USERS</code>*
                + <code>DYNAMODB_TABLE_NAME_SCORES</code>*
            </td>
            <td>
                <code>SKILL_ID_LIVE</code>
            </td>
            <td>
                dice championship
            </td>
            <td>
                <img src="https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChallenge_small.png">
            </td>
        </tr>
    </table>
    * It would make sense for your live Skill to use different databases than the `local` and `staging` stages<br/><br/>
2. **Uploading your Skill code to Lambda**
   - After having reviewed the staging setup, it's clear that uploading your Skill to Lambda is as easy as building and deploying the **staging stage** of your project.
   - To be able to upload your code to Lambda with the Jovo CLI, make sure your AWS CLI profile is linked to your ASK CLI profile, and has Lambda upload privileges
   - Now all you need to do it execute `jovo build -p alexaSkill --stage staging --deploy`
   - The result should look like this: <br/>
    <img src="https://dicechampionship.s3-eu-west-1.amazonaws.com/diceChampionship_buildStaging_live.png" width="90%"><br/>
   - Again, you can now test your Skill in the Alexa developer console just like after step 5, in the same Skill
3. **Preparing and deploying the live stage**
   - I'll cover this part more briefly than the ones before, because it's more about deployment than about getting this Skill to work
   - First, you need a **new Lambda function** - Just set one up like in **step 4** (with the same role, trigger and environment variables), and copy its ARN as the value of `LAMBDA_ARN_LIVE` in your `.env` file
   - If you want to use **different DynamoDB tables** for your live stage, you need to set up the score table (with the same hash key `id`), paste its name into the environment variable `DYNAMODB_TABLE_NAME_SCORES` of your Lambda function, and accordingly expand your policy `diceChampionship_policy`'s resource part.<br/> If you want a different table for user data for this stage, just write the name you want the new DynamoDB table to have as the value of `DYNAMODB_TABLE_NAME_SCORES`, and the Jovo framework's DynamoDB integration will set it up for you.
   - To set up the **new Skill** (using the new Lambda endoint, the invocation name 'dice championship', and an expanded version of the manifest including a different Skill icon), execute `jovo build -p alexaSkill --stage live --deploy`. 
   - After the first deployment, copy the new Skill's ID and paste it as the value of `SKILL_ID_LIVE` in your `.env` file

# Wrapping it up
I hope you find both this entire project and the individual variants interesting and valuable. Again, if you like this project and want to see it implementing your favorite platform, service or feature, please get in touch or start implementing right away.

## Thanks for reading! :)