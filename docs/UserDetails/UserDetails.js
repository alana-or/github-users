const plantuml = require('plantuml');
const fs = require('fs');

(async () => {
    try {
        const svg = await plantuml(`
            @startuml
            actor User

            participant "UserDetail Component\n(UserDetail.tsx)" as UserDetail
            participant "Next.js Server\n(getStaticProps)" as Server
            participant "GitHub API" as GitHubAPI

            User -> Server : Request UserDetail Page
            Server -> GitHubAPI : GET /users/:username
            GitHubAPI -> Server : Return User Data

            Server -> GitHubAPI : GET /users/:username/repos
            GitHubAPI -> Server : Return Repos Data

            Server -> UserDetail : Return Static Props

            UserDetail -> User : Render UserDetail Page
            @enduml
        `);

        fs.writeFileSync('docs/UserDetails.svg', svg);
        console.log('Diagrama gerado e salvo como image.svg');
    } catch (error) {
        console.error('Erro ao gerar o diagrama:', error);
    }
})();
