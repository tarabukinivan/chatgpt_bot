import shell from 'shelljs';

export function shellexe(commd, txdata ='') {
    try {
        tmp = shell.exec(commd, {silent: true, shell: '/bin/bash'}).stdout.trim();
    } catch (e) {
        console.log(e);
        tmp = 'Error get logs';
    }    
    return tmp
}
