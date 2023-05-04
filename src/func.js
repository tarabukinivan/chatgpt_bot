import shell from 'shelljs';

export function shellexe(commd, txdata ='') {
    try {
        shell.exec(commd, {silent: true, shell: '/bin/bash'}).stdout.trim();
    } catch (e) {
        console.log(e);        
    }
}
