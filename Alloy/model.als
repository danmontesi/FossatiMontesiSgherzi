open util/boolean
open util/integer

sig UserName in String {} {
	all userName: UserName | one c: Customer | c.username = userName
}

abstract sig Sensor {
	available: one Bool
}

sig HeartRateSensor extends Sensor {}
sig SleepMonitoringSensor extends Sensor {}
sig PressureSensor extends Sensor {}

sig SmartWatch {
	sensors: set Sensor,
	user: one User
}


fact atLeastSleepMonitoring {
	all sw: SmartWatch, sms: SleepMonitoringSensor | #sw.sensors = 1 => sms in sw.sensors
}

fact UserSmartwatchConsistency {
	all smw: SmartWatch, u: User | smw.user = u <=> u.smartwatch = smw
}

sig Notification {
	user: one User,
	method: one String,
	company: one Company
}

sig FiscalCodeOrSSN in String {} {
	all fcssn: FiscalCodeOrSSN | one u: User | u.fiscalCodeOrSSN = fcssn
}

abstract sig Customer {
	username: lone UserName, 
	password: lone String,
	isRegistered: one Bool,
	canRegister: one Bool
} {
	isRegistered = True => canRegister = True
}

sig Company extends Customer {
	paymentMethod: lone String,
	queries: set CompanyQuery
} {
	isRegistered = True => #queries >= 0
}

sig User extends Customer {
	fiscalCodeOrSSN: lone FiscalCodeOrSSN,
	hasCompatibleSmartwatch: lone Bool,
	acceptsPersonalRequestsFrom: set Company,
	notifications: set Notification,
	smartwatch: one SmartWatch
} {
	all n: Notification | n in notifications => n.user = this
}

abstract sig Query {
	company: one Company
}

sig CompanyQuery {
	people: set User,
	isValid: one Bool
} {
	#people < 5 <=> isValid = False
}

sig PersonalQuery extends Query {
	person: one User,
	accepted: lone Bool
} {
	company in person.acceptsPersonalRequestsFrom => accepted = True
	#accepted = 0 => company in person.(notifications.company)
}

fact QueryAlwaysBelongsToCompany {
	all q: CompanyQuery {
		one c: Company {
			q in c.queries <=> q.company = c
		}
	}
}

// Goal G2: User can register
fact UserIsRegistered {
	all u: User {
		u.isRegistered = True => u.hasCompatibleSmartwatch = True and #u.fiscalCodeOrSSN = 1 and #u.username = 1 and #u.password = 1 
	}
}

assert UserCanRegister {
	all u: User {
		u.hasCompatibleSmartwatch = True and #u.fiscalCodeOrSSN = 1 and #u.username = 1 and #u.password = 1 => u.canRegister = True
	}
}

check UserCanRegister for 5

// Goal G3: Companies can register
fact CompanyIsRegistered {
	all c: Company {
		c.isRegistered = True => #c.username = 1 and #c.password = 1 and #c.paymentMethod = 1
	}
}

assert CompanyCanRegister {
	all c: Company {
		#c.username = 1 and #c.password = 1 and #c.paymentMethod = 1 => c.canRegister = True
	}
}

check CompanyCanRegister for 5

// Goal G4: the  system  should  allow  registered  companies  
// to make queries from  an  anonymized  group  of  individuals, 
// only  if  individuals  in  the group are more than 1000 (5)

assert QueryIsValid {
	all q: CompanyQuery | all c: Company | q in c.queries => #q.people >= 5
}
check QueryIsValid for 5

// G5: The system should allow registered companies to request data
// from an individual person, only if individuals accept the request.

assert CompaniesCanMakeIndividualQueries {
	all q: PersonalQuery, c: Company, u: User, n: Notification {
		q.company = c && q.person = u  <=> c in u.acceptsPersonalRequestsFrom || n in u.notifications && n = c.company
	}
}

check CompaniesCanMakeIndividualQueries for 5



// pred showWithValidQueries{
// 	#User > 5
// }

// pred showWithInvalidQueries {
// 	#User < 5
// }

// run showWithValidQueries for 5 but 2 Company, 4 PersonalQuery, 2 CompanyQuery, 3 Notification, 5 User
// run showWithInvalidQueries for 5 but 2 Company, 4 PersonalQuery, 2 CompanyQuery, 3 Notification, exactly 4 User
