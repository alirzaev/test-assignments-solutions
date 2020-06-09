select distinct on(e.department) e.name, e.department, e.salary
from employee e
join (select department, max(salary) as salary
      from employee group by department) mx
on e.department = mx.department and e.salary = mx.salary;
