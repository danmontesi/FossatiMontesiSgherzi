open util/boolean

// Signatures


abstract sig Sensor {
    available: one Bool
}

sig HeartRateSensor extends Sensor{}
sig BloodPressureSensor extends Sensor{}
sig SleepMonitoringSensor extends Sensor{}


sig Smartwatch {
    user: one User,
    sensors: set Sensor,
    compatible: one Bool
} {
    // Must have at least 3 different sensors:
    // HeartRateSensor, BloodPressureSensor, SleepMonitoringSensor
    all disj s, s', s'': Sensor {
        ((s in sensors && s' in sensors && s'' in sensors) &&
        (s != s' && s' != s'' && s != s'') && 
       ( s.available = True && s'.available = True && s''.available = True)) <=> compatible = True
    }
}


abstract sig Customer {
    username: lone String, 
    password: lone String,
    canRegister: one Bool,
    isRegistered: one Bool
} {
    isRegistered = True => canRegister = True
    canRegister = False => isRegistered = False
    #username = 0 || #password = 0 => canRegister = False 
}

sig User extends Customer {
    fiscalCodeOrSSN: lone String,
    smartwatch: one Smartwatch,
    notifications: set Notification, 
    acceptsDataRequestFrom: set Company
} {
    (#fiscalCodeOrSSN = 0 || smartwatch.compatible = False) => canRegister = False
}

sig Company extends Customer {
    paymentMethod: lone String,
    queries: set Query
} {
    #paymentMethod = 0 => canRegister = False
    isRegistered = False => #queries = 0
}

abstract sig Query {
    company: one Company
}

sig AnonQuery extends Query {
    people: set User,
    isValid: one Bool
} {
    isValid = True <=> #people >= 5
}

sig IndividualQuery extends Query {
    person: one User,
    userAccepts: lone Bool, // lone cause if #userAccepts = 0 it must mean that a notification had been received by the user
} {
    all u: User {
        u = person => userAccepts = True else #userAccepts = 0 && #person.notifications > 0
    }
}

sig Notification {
    user: one User,
    company: one Company
}

// Facts: Consistency

fact UsernameConsistency {
    // There are no 2 Customer(s) with the same username
    all disj c, c': Customer | c.username != c'.username
}

fact FiscalCodeOrSSNConsistency {
    // There are no 2 User(s) with the same fiscalCodeOrSSN
    all disj u, u': User | u.fiscalCodeOrSSN != u'.fiscalCodeOrSSN
}

fact SmartWatchConsistency {
    // Let's suppose, wlog, that the cardinality of the relation
    // between smartwatch and user is 1 to 1
    all s: Smartwatch, u: User | s.user = u <=> u.smartwatch = s
}

fact QueryConsistency {
    // If a query has been made by a company
    // it must be in the set of all the queries 
    // made by the company
    all q: Query, c: Company | q.company = c <=> q in c.queries
}

fact NotificationConsistency {
    // If a notification has been sent to a user
    // the user must have it in the set of 
    // all notifications
    all n: Notification, u: User | n.user = u <=> n in u.notifications
}

// Assertions 

// Goal G2: The system should allow users to register by providing his 
// Fiscal Code or his Social Security Number, an username and a password. 

assert UserCanRegister {
    all u: User {
        (
            #u.username = 1 && 
            #u.password = 1 && 
            #u.fiscalCodeOrSSN = 1 &&
            u.isRegistered = False && 
            u.(smartwatch.compatible) = True
        ) => u.canRegister = True
    }
}

check UserCanRegister for 5

// Goal G3: The system should allow companies to register

assert CompaniesCanRegister {
    all c: Company {
        (
            #c.username = 1 && 
            #c.password = 1 &&  
            #c.paymentMethod = 1 
        ) => c.canRegister = True
    }
}

check CompaniesCanRegister for 5

// Goal G4: The system should allow registered companies to request data
// from an anonymized group of individuals, only if individuals in the
// group are more than 1000.

assert CompaniesCanMakeAnonimizedQueries {
    all c: Company, q: AnonQuery{
        (
            c.isRegistered = True && 
            #queries > 0 && 
            #q.people >= 5
        ) => q.isValid = True && q in c.queries

    }
}

check CompaniesCanMakeAnonimizedQueries for 5

// Goal G5: The system should allow registered companies to request data
// from an individual person, only if individuals accept the request.

assert CompaniesCanMakeIndividualQueries {
    
    // If a company requests data from a single person 
    // either
    // the person accepts <=> company is in the person acceptance list
    // or 
    // the person still hasn't accepted => there's a notification concerning the company and the user in the person notification list

    all q: IndividualQuery, c: Company, n: Notification {
        (q.company = c) &&
        (
            (q.userAccepts = True <=> c in q.(person.acceptsDataRequestFrom)) ||
            (#q.userAccepts = 0 => (
                n.user = q.person && 
                n.company = c && 
                n in q.(person.notifications)
            )) 
        )
    }

}

check CompaniesCanMakeAnonimizedQueries for 5

pred show{}

run show for 10
