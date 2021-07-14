import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTable1626228405913 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`users\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`email\` VARCHAR(45) NOT NULL,
                \`password\` VARCHAR(45) NOT NULL,
                \`name\` VARCHAR(45) NOT NULL,
                \`profession\` VARCHAR(45) NOT NULL,
                PRIMARY KEY (\`id\`));`);
    }

    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE IF EXISTS users;`);
    }
}
