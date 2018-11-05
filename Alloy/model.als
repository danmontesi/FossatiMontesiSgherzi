open util/boolean
open util/integer

sig UserName in String {} {
	all userName: UserName | one c: Customer | c.username = userName
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
	queries: set Query
}

sig User extends Customer {
	fiscalCodeOrSSN: lone FiscalCodeOrSSN,
	hasCompatibleSmartwatch: lone Bool,
}

sig Query {
	company: one Company, 
	people: set User,
	isValid: one Bool
} {
	#people < 10 <=> isValid = False
}

fact QueryAlwaysBelongsToCompany {
	all q: Query {
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

// Goal G4: the  system  should  allow  registered  companies  to make query ...
assert CompaniesCanMakeQueries {
	all c: Company{
		c.isRegistered = True => #c.queries >= 0
		c.isRegistered = False => #c.queries = 0
	}
}

// Goal G4: ... from  an  anonymized  group  of  individuals,  only  if  individuals  in  the group are more than 1000
assert QueryIsValid {
	all q: Query | all c: Company | q in c.queries => #q.people > 9
}
check CompaniesCanMakeQueries for 5
check QueryIsValid for 5