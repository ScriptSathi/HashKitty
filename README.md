# Kracceis

This project is another webui for hashcat, but still under construction.

```
const execOptions: TExecEndpoint = {
        flags: [
            {
                name: 'hashType',
                arg: '1000',
            },
            {
                name: 'session',
                arg: 'session1',
            },
            {
                name: 'attackMode',
                arg: '0',
            },
            // {
            //     name: 'restoreDisable',
            // },
            // {
            //     name: 'potfilePath',
            //     arg: '/opt/potfiles/toto.txt',
            // },
        ],
        wordlist: '/opt/kracceis/wordlists/rockyou.txt',
        hashList: {
            name: 'test2',
            hashs: [
                '90B0563973F20399F6CC4AA9790E5111',
                '9869A2E7E99474C763301F00409058DB',
                '9869A2E7E99474B743301F00409058DB',
                '9869A2E7E99478B763301F00409058DB',
                '9869A2E7E99474B763101F00409058DB',
                '9869A2E7E99874B763301F00809058DB',
                '9869A2E7E99474B763301F00409058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B963301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B767301F00009058DB',
                '9869A2E7EB9474B763001F00009058DB',
                '1869A2E7EB9474B7637301F0009058DB',
                '9869A2E7EB9474B7633A0F00009058DB',
            ],
        },
    };

    const restoreOptions: TRestoreEndpoint = {
        name: 'session',
        arg: 'session1',
    };



    {"flags":[{"name":"hashType","arg":"1000"},{"name":"session","arg":"session1"},{"name":"attackMode","arg":"0"},{"name":"restoreDisable"}],"wordlist":"/opt/kracceis/wordlists/rockyou.txt","hashList":{"name":"test2","hashs":["90B0563973F20399F6CC4AA9790E5111","9869A2E7E99474C763301F00409058DB","9869A2E7E99474B743301F00409058DB","9869A2E7E99478B763301F00409058DB","9869A2E7E99474B763101F00409058DB","9869A2E7E99874B763301F00809058DB","9869A2E7E99474B763301F00409058DB","9869A2E7EB9474B763301F00009058DB","9869A2E7EB9474B763301F00009058DB","9869A2E7EB9474B763301F00009058DB","9869A2E7EB9474B763301F00009058DB","9869A2E7EB9474B763301F00009058DB","9869A2E7EB9474B763301F00009058DB","9869A2E7EB9474B763301F00009058DB","9869A2E7EB9474B763301F00009058DB","9869A2E7EB9474B763301F00009058DB","9869A2E7EB9474B963301F00009058DB","9869A2E7EB9474B763301F00009058DB","9869A2E7EB9474B767301F00009058DB","9869A2E7EB9474B763001F00009058DB","1869A2E7EB9474B7637301F0009058DB","9869A2E7EB9474B7633A0F00009058DB"]}}

    {"name":"session","arg":"session1"}
    
```
```
#privileged containers
# https://stackoverflow.com/questions/32163955/how-to-run-shell-script-on-host-from-docker-container

docker run --privileged --pid=host -it alpine:3.8 \
nsenter -t 1 -m -u -n -i sh

BDD:  


// Sauvegarder les données lié aux tasks (tout en bdd)
// sauvegarder la donnée lié aux hash lists (type de hash et si elle est lié à une tâche)
// sauvegarder les templates de taches
