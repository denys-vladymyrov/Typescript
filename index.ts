
🔹 Типы

let isDone: boolean = true;
let age: number = 25;
let username: string = "Denys";
let ids: number[] = [1, 2, 3];
let tuple: [string, number] = ["apple", 10];
let anything: any = "может быть чем угодно";
let unknownValue: unknown = 42; // безопаснее, чем any



🔹 Literal Union

let a: "on" | "off" = "on";
type ButtonVariant = "primary" | "secondary" | "ghost";



🔹 Union & Intersection

let id: string | number = 123;   // union (или)
type User = { name: string };
type Admin = { role: string };
type AdminUser = User & Admin;   // intersection (и то, и то)



🔹 Type Narrowing

function printId(id: string | number) {
    if (typeof id === "string") {
        console.log(id.toUpperCase());
    } else {
        console.log(id.toFixed(2));
    }
}

// narrow down objects
type Founder = {
    name: 'John Founder',
    car: 'Audi'
} | {
    name: 'Bill Bicycle',
    bike: 'Wheels'
}

function meetTheFounder(founder: Founder){
    console.log(`Meet your fonder ${founder.name}`)
    if (founder.name === 'John Founder') {
        console.log(`I drive a ${founder.car}`)
    }
    if (founder.name === 'Bill Bicycle') {
        console.log(`I don't drive so I use my bike called ${founder.bike}`)
    }
}

meetTheFounder({
    name: 'John Founder',
    car: 'Audi'
})

meetTheFounder({
    name: 'Bill Bicycle',
    bike: 'Wheels'
})




🔹 Type Guard | Type Predicate

type Salary = {
    amount: number
}

// Type guard: narrow down an object
// Type predicate
function isSalary(arg: any): arg is Salary{
    return (('amount' in arg) && (typeof arg.amount === 'number'))
}

function paySalary(arg: unknown) {
    if (isSalary(arg)) {
        // here arg is of type Salary
        console.log(`Paying ${arg.amount}`)
    }
}



🔹 Type Assertion

type SimpleJob = {
    codingLanguage: string,
    sourceControl: string
}

type ComplicatedJob = {
    codingLanguage: string,
    sourceControl: string,
    hasManyMeetings: true,
    reportsToBeCompleted: string[]
}

type QaJob = {
    scriptingLanguage: string,
    hasAutomatedTests: true
}

let simpleJob: SimpleJob = { codingLanguage: 'TS', sourceControl: 'git' }

let complicatedJob: ComplicatedJob = {
    codingLanguage: 'TS', sourceControl: 'git', hasManyMeetings: true, reportsToBeCompleted: ['hourly', 'daily', 'weekly']
}

let qaJob: QaJob = {
    scriptingLanguage: 'Python',
    hasAutomatedTests: true
}

simpleJob = complicatedJob
complicatedJob = simpleJob as ComplicatedJob
complicatedJob = qaJob as unknown as ComplicatedJob

// same meaning:
complicatedJob = <ComplicatedJob>simpleJob;
complicatedJob = <ComplicatedJob><unknown>qaJob

// usage: build objects in steps:
// advantage: autocomplete assistance
// disadvantage: the compiler won't complain about incomplete objects
const complicatedJobMadeInSteps = {} as ComplicatedJob
complicatedJobMadeInSteps.codingLanguage = 'C#';
complicatedJobMadeInSteps.hasManyMeetings = true;
complicatedJobMadeInSteps.reportsToBeCompleted = []
complicatedJobMadeInSteps.sourceControl = 'git'



🔹 Type Intersection

// Types
type SimpleJob = {
    codingLanguage: string,
    sourceControl: string
}

type ComplicatedJob = SimpleJob & { // type intersection
    hasManyMeetings: true,
    reportsToBeCompleted: string[],
}

let complicatedJob: ComplicatedJob = {
    codingLanguage: 'TS',
    sourceControl: 'git',
    hasManyMeetings: true,
    reportsToBeCompleted: ['hourly', 'daily', 'weekly']
}

type MeetingHolder = {
    meetingMaxLength: number
    holdMeeting: ()=> void
}

class ProjectManager implements MeetingHolder {

    meetingMaxLength = 60;
    holdMeeting = ()=>{
        console.log('Just holding a meeting')
    }
}


// Interfaces
interface SimpleJob {
    codingLanguage: string,
    sourceControl: string
}

interface ComplicatedJob extends SimpleJob {
    hasManyMeetings: true,
    reportsToBeCompleted: string[]
}

let complicatedJob: ComplicatedJob = {
    codingLanguage: 'TS',
    sourceControl: 'git',
    hasManyMeetings: true,
    reportsToBeCompleted: ['hourly', 'daily', 'weekly']
}

interface MeetingHolder {
    meetingMaxLength: number
    holdMeeting: ()=> void
}

interface MeetingHolder {
    endMeeting: ()=> void
}

class ProjectManager implements MeetingHolder {

    meetingMaxLength = 60;
    holdMeeting = ()=>{
        console.log('Just holding a meeting')
    }
    endMeeting = ()=> {
        console.log('Finally the meeting ended')
    }

}



🔹 Enum

// enums: a group of constants
enum Position {
    Programmer = 'Programmer',
    HR = 'HR',
    Manager = 'Manager',
    /**
     * Must receive at least 2000% yearly bonus
     */
    CEO = 'CEO'
}

type Employee = {
    name: string
    salary: number
    position: Position
}

function payBonus(empl: Employee) {
    // Pay CEO bonus:
    if (empl.position === Position.CEO) {
        // surprize bonus
    }
}

// if we don't cover the case with Manager - we will get an ts error in the default case
function payAnnualBonus(empl: Employee) {
    let bonusPercent: number = 0;
    const position = empl.position
    switch (position) {
        case Position.Programmer:
            bonusPercent = 0.2
            break;
        case Position.HR:
            bonusPercent = 0.8
            break;
        case Position.CEO:
            bonusPercent = 200
            break;
        default:
            // exhaustive enum:
            const remainingValues: never = position;
            break;
    }
    console.log(`Paying ${empl.salary * bonusPercent} as bonus to ${empl.name}`)
}




🔹 Utility types


type Employee = {
    name: string,
    position: string,
    salary: {
        amount: number,
        currency: string,
        bonus?: 10 | 20 | 30
    }
    isAdmin: boolean,
    employedAt: string
    likesMeetings?: boolean
    team?: string
}

type RequiredEmployee =  Required<Employee>
type OptionalEmployee =  Partial<Employee>
type ReadonlyEmployee = Readonly<Employee>


// Pick
type SalaryPick = Pick<Employee, 'salary'>
type Salary = Employee['salary']

// Omit
type SanitizedEmployee = Omit<Employee, 'employedAt'> & {
    employedAt: Date
}


function getSalaryHistory(id: string){
    return {
        formerEmployee: 'Google',
        formerPosition: 'CEO',
        formerSalary: 100000000,
        oldDuties: ['invent search engines', 'create Gmail']
    }
}

type oldPosition = ReturnType<typeof getSalaryHistory>




🔹 Function overloading


function oneYearAgo(date: Date): Date
function oneYearAgo(date: string): string
function oneYearAgo(date: Date | string) {
    const oneYearAgo = new Date(date);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    if (typeof date === 'string') {
        return oneYearAgo.toLocaleDateString();
    } else {
        return oneYearAgo;
    }
}
const lastYearDate = oneYearAgo(new Date())
const lastYearString = oneYearAgo('6/9/2026')


function paySalary(monthlySalary: number): void;
function paySalary(monthlySalary: number, hoursOvertime: number, payPerHour: number): void;
function paySalary(monthlySalary: number, hoursOvertime?: number, payPerHour?: number) {
    let overtimePay = 0;
    if (hoursOvertime && payPerHour) {
        overtimePay = hoursOvertime * payPerHour
    }
    const totalPayment = monthlySalary + overtimePay;
    console.log(`For this month, you received ${totalPayment} $`)
}

paySalary(5000);
paySalary(5000, 10, 10)
// @ts-expect-error
paySalary(5000, 20)

function paySalaryWithOptionsObject(monthlySalary: number,
                                    overtime?: { hoursOvertime: number, payPerHour: number }) { }




🔹 Classes


class Project {

    name: string;
    budget: number;

    constructor(name: string, budget: number) {
        this.name = name;
        this.budget = budget;
    }

    printBudget() {
        console.log(`${this.name} has a budget of ${this.budget}`)
    }

}

class SecretProject extends Project {

    secrecyLevel: 1 | 2 | 3

    constructor(secrecyLevel: 1 | 2 | 3) {
        super('Secret project', 1000000);
        this.secrecyLevel = secrecyLevel
    }

    override printBudget() {
        console.log(`The budget is secret!!!`)
    }
}

const secretProject = new SecretProject(3);
secretProject.printBudget();



abstract class AbstractProject {

    constructor(public name: string, public budget: number) {
        this.name = name;
        this.budget = budget;
    }

    printBudget() {
        console.log(`${this.name} has a budget of ${this.budget}`)
    }

    abstract makeDelivery(): void

}

class AiProject extends AbstractProject {

    override makeDelivery(): void {

    }

}

const coolProject = new AiProject('CoolProject', 10000);




interface HrManager {
    getAllSalaries(): string[]
}

interface ScrumMaster {
    holdScrumMeeting(): void
}

class SwissArmyKnife implements HrManager, ScrumMaster{

    getAllSalaries(): string[] {
        return []
    }
    holdScrumMeeting(): void {
        console.log('Holding scrum meeting ... ')
    }

}

class Project {
    name: string;
    budget: number;
    scrumMaster: ScrumMaster

    constructor(name: string, budget: number, scrumMaster: ScrumMaster){
        this.name = name;
        this.budget = budget;
        this.scrumMaster = scrumMaster;
    }

    holdProjectMeeting(){
        this.scrumMaster.holdScrumMeeting();
    }
}

const superManager = new SwissArmyKnife();
const basicProject = new Project('Basic project', 100, superManager)




🔹 Generics


const names: string[] = []
const names2: Array<string> = []

type Employee = {
    name: string,
    role: string
}

async function getEmployees<T>(url: string):Promise<T[]> {
    const result = await fetch(url)
    const parsedResult = await result.json()
    return parsedResult;
}

async function wrapper(){
    const employees = await getEmployees<Employee>('internalEmployeeService.com')
    const firstEmployee = employees[0];
}



// 🟢 generic constraints
type objectWithTeam = {
    team: string
}

type Programmer = objectWithTeam & {
    name: string,
    language: string
}

function updateTeam<T extends objectWithTeam>(arg: T, newTeam: string): T{
    arg.team = newTeam;
    return arg;
}

let empl1: Programmer = {
    name: 'John',
    language: 'C#',
    team: 'CoolTeam'
}
updateTeam(empl1, 'SuperCoolTeam')

type OldSchoolProgrammer<T extends 'Basic' | 'Lisp' = 'Basic'> = {
    language: T,
    name: string
}

const myCoolColleague: OldSchoolProgrammer = {
    language: 'Basic',
    name: 'John'
}



// 🟢 multiple types
const scrumRole = {
    holdsMeetings: false,
    teams: ['Team1', 'team2']
}

const productOwnerRole = {
    holdsMeetings: true,
    reportsTo: 'upperManagement'
}

function mergeRoles<T extends object, G extends object>(role1: T, role2: G): T & G{
    return {...role1, ...role2}
}

const scrumProductOwnerRole = mergeRoles(scrumRole, productOwnerRole);
console.log(scrumProductOwnerRole)



// 🟢 generic classes
class MemoryDataBase<T> {

    protected items = new Array<T>();

    public addItem(item: T){
        this.items.push(item);
    }

    public getItemByIndex(index: number): T | undefined{
        return this.items[index]
    }

    public listItems(){
        this.items.forEach(item=> {
            console.log(item)
        })
    }
}

const namesDataBase = new MemoryDataBase<string>()
namesDataBase.addItem('John')
const first = namesDataBase.getItemByIndex(0)


class MemoryDataBaseWithDelete<T extends {id: string}> extends MemoryDataBase<T> {

    public delete(id: string) {
        const index = this.items.findIndex(x => x.id === id)
        this.items.splice(index, 1);
    }
}

const dataBaseWithIds = new MemoryDataBaseWithDelete<{id: string}>()
dataBaseWithIds.addItem({id: '123'})
const firstId = dataBaseWithIds.getItemByIndex(0)


// 🟢 generic interfaces and types
interface DoubleArray<T,R> {
    array1: Array<T>,
    array2: Array<R>
}

type Programmer = {}
type Manager = {}

const employees: DoubleArray<Programmer, Manager> = {
    array1: [],
    array2: []
}

interface IMemoryDataBase <T> {
    addItem(item: T): void
    getItemByIndex(index: number): T | undefined
    listItems(): void
}



🔹 Advanced types


const CEO = 'Jeff' // strings are immutable

const CeoObject = { // objects are not immutable
    name: 'Jeff',
    company: 'Amazon'
} as const

// CeoObject.name = 'Bill'

function toUpperCaseNames(names: ReadonlyArray<string>){
    // names.push('My Name')
    return names.map(name =>{
        return name.toUpperCase()
    })
}


type Position = 'Programmer' | 'Manager' | 'HR' | 'Scrum master'

type Employee = {
    name: string,
    position: Position
}

function paySalary(empl: Employee){
    console.log(`The pay for ${empl.position} is 10000 `)
}

const john = {
    name: 'John',
    position: 'Programmer'
} as const

paySalary(john)


// 🟢 Record and index signature
type Employee = {
    name: string,
    position: string,
    [key: string]: string | number
}

const john: Employee = {
    name: 'John',
    position: 'programmer',
    // extend the object?
    email: 'john@company.com',
    age: 30
}

// type EmployeeDictionary = {
//     [id: string]: Employee
// }

const employeesRecords: Record<string, Employee> = {
    abc: john
}

const myEmployee = employeesRecords['abc']

// we get type safety for combining types:

type Positions = 'Programmer' | 'Manager' | 'HR' | 'Scrum Master'

type PositionsSalaries = Record<Positions, { salary: number }>

const salaries: PositionsSalaries = {
    Programmer: {
        salary: 100000
    },
    HR: {
        salary: 100000
    },
    Manager: {
        salary: 100000
    },
    'Scrum Master': {
        salary: 100000
    }
}


// 🟢 keyof vs Object.keys
type Position = 'Programmer' | 'Manager' | 'HR' | 'Scrum master'

type Employee = {
    name: string,
    position: Position
}

type EmployeeKeys = keyof Employee // 'name' | 'position'

const john: Employee = {
    name: 'John',
    position: 'Programmer'
}

john['name']

function getProperty2(arg: any, key: string){
    console.log(arg[key])
    return arg[key]
}

function getProperty<T, K extends keyof T>(arg: T, key: K): T[K] {
    console.log(arg[key])
    return arg[key]
}

const johnsName = getProperty(john, 'name')
getProperty(john, 'position')
// getProperty(john, 'age')

function getObjectKeys2<T extends object>(arg: T){
    return Object.keys(arg)
}

function getObjectKeys<T extends Record<string, any>>(arg: T):Array<keyof T>{
    return Object.keys(arg)
}


const someKeys = getObjectKeys([]);
const existingKeys = getObjectKeys({
    abc: 'def'
})




🔹 Literal types


const firstName = 'Jeff'
const lastName = 'Gates'
const fullName = `${firstName} ${lastName}` // Jeff Gates


type Level = 'Junior' | 'Senior' | 'Expert'
type Position = 'Programmer' | 'Hr' | 'Manager'

type LeveledPosition = `${Level} ${Position}`

type Prefixed<Prefix extends string, T extends string> = `${Prefix} ${T}`
let awesomePositions: Prefixed<'Awesome', Position>

// Intrinsic String Manipulation Types:

let lowerCasePositions:Lowercase<Position>
let upperCasePositions:Uppercase<Position>
let uncapitalizedPositions: Uncapitalize<Position>



🔹 Mapped types


type Position = 'Programmer' | 'HR' | 'Manager' | 'ScrumMaster'

type PositionDuties = {
    Programmer: string[],
    HR: string[],
    Manager: string[]
}

type PositionDutiesMap = {
    [position in Position]: string[]
}

type PositionDutiesMapGeneric<T extends string> = {
    [key in T]: string[]
}




🔹 Promise Types



async function getEmployees() {
    return Promise.resolve([
        {
            name: 'John',
            position: 'Programmer',
            salary: 100000
        }
    ])
}

async function wrapper() {
    const employees = await getEmployees();
}

type EmplServiceReturnType = Awaited<ReturnType<typeof getEmployees>>

function getService() {
    return Promise.resolve('www.myCompany.com')
}

async function resolveServiceFirst<T>(service: Promise<T>) {
    const result = await service
    console.log(result);
}

resolveServiceFirst(getService())
