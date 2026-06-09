export default {
  title: "OOPs in Java",
  subtitle: "Object-Oriented Programming \u2014 Hinglish mein Complete Guide with Code",
  subtitleColor: "#e0f7fa",
  headerGradient: "linear-gradient(135deg,#0d47a1,#1565c0,#42a5f5)",
  footerText: "OOPs in Java",
  content: `
<!-- ============ 1. OOPs BASICS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>OOPs Basics &mdash; Class, Object, Constructor</div>

    <p style="color:#b0bec5;margin-bottom:16px;font-size:1.05em"><strong style="color:#69f0ae">OOPs kya hai?</strong> &mdash; Object-Oriented Programming ek <b>programming paradigm</b> hai jisme hum real-world cheezein (objects) ko code mein represent karte hain. Java poori tarah OOPs pe based hai &mdash; <em>"Everything is an Object!"</em></p>

    <div class="sub-heading" style="color:#66bb6a;border-color:#66bb6a">Class &amp; Object &mdash; Blueprint aur Real Cheez</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div style="background:rgba(102,187,106,.06);border:1px solid rgba(102,187,106,.15);border-radius:12px;padding:16px">
            <strong style="color:#66bb6a">Class (Blueprint)</strong>
            <p style="color:#b0bec5;font-size:.88em;margin-top:6px">Class ek <b>blueprint</b> hai &mdash; jaise ghar ka naqsha. Usme likha hota hai ki object mein kya-kya hoga (variables + methods). Class se koi memory allocate nahi hoti.</p>
        </div>
        <div style="background:rgba(102,187,106,.06);border:1px solid rgba(102,187,106,.15);border-radius:12px;padding:16px">
            <strong style="color:#66bb6a">Object (Real Instance)</strong>
            <p style="color:#b0bec5;font-size:.88em;margin-top:6px">Object class ka <b>real instance</b> hai &mdash; jaise naqshe se bana hua asli ghar. <code>new</code> keyword se banta hai. Har object ki apni alag memory hoti hai heap mein.</p>
        </div>
    </div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">ClassAndObject.java</span></div><pre class="code-block">
<span class="cm">// Class = Blueprint (naqsha)</span>
<span class="kw">class</span> <span class="cn">Car</span> {
    String brand;    <span class="cm">// property (kya hai)</span>
    int speed;       <span class="cm">// property</span>

    <span class="kw">void</span> <span class="fn">drive</span>() {   <span class="cm">// method (kya karta hai)</span>
        System.out.println(brand + <span class="st">" is driving at "</span> + speed + <span class="st">" km/h"</span>);
    }
}

<span class="cm">// Object = Real instance (asli ghar)</span>
<span class="kw">public class</span> <span class="cn">Main</span> {
    <span class="kw">public static void</span> <span class="fn">main</span>(String[] args) {
        Car myCar = <span class="kw">new</span> Car();   <span class="cm">// Object bana &mdash; heap mein memory allocate hui</span>
        myCar.brand = <span class="st">"BMW"</span>;
        myCar.speed = 120;
        myCar.drive();              <span class="cm">// Output: BMW is driving at 120 km/h</span>
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#66bb6a;border-color:#66bb6a">Constructor &mdash; Object Banate Waqt Automatically Call Hota Hai</div>
    <p style="color:#b0bec5;margin-bottom:12px;font-size:.92em"><strong>Constructor</strong> ek special method hai jo object create hote hi <b>automatically</b> call hota hai. Iska naam class ke naam jaisa hota hai, aur <b>return type nahi</b> hota.</p>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Constructor.java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">Student</span> {
    String name;
    int age;

    <span class="cm">// Default Constructor &mdash; bina parameter ke</span>
    <span class="fn">Student</span>() {
        name = <span class="st">"Unknown"</span>;
        age = 0;
    }

    <span class="cm">// Parameterized Constructor &mdash; values pass kar sakte ho</span>
    <span class="fn">Student</span>(String name, <span class="tp">int</span> age) {
        <span class="kw">this</span>.name = name;   <span class="cm">// 'this' current object ko refer karta hai</span>
        <span class="kw">this</span>.age = age;
    }

    <span class="cm">// Copy Constructor &mdash; ek object se dusra copy karo</span>
    <span class="fn">Student</span>(Student other) {
        <span class="kw">this</span>.name = other.name;
        <span class="kw">this</span>.age = other.age;
    }
}

<span class="cm">// Usage</span>
Student s1 = <span class="kw">new</span> Student();               <span class="cm">// Default: name=Unknown, age=0</span>
Student s2 = <span class="kw">new</span> Student(<span class="st">"Rahul"</span>, 22);   <span class="cm">// Parameterized</span>
Student s3 = <span class="kw">new</span> Student(s2);             <span class="cm">// Copy: name=Rahul, age=22</span>
    </pre></div>

    <div class="sub-heading" style="color:#66bb6a;border-color:#66bb6a"><code>this</code> &amp; <code>static</code> Keyword</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:10px">
        <div style="background:rgba(102,187,106,.06);border:1px solid rgba(102,187,106,.15);border-radius:12px;padding:16px">
            <strong style="color:#66bb6a">this keyword</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px"><b>this</b> current object ko point karta hai. Jab parameter aur variable ka naam same ho, toh <code>this.name = name</code> se differentiate karte hain. <code>this()</code> se ek constructor se dusra call kar sakte ho.</p>
        </div>
        <div style="background:rgba(102,187,106,.06);border:1px solid rgba(102,187,106,.15);border-radius:12px;padding:16px">
            <strong style="color:#66bb6a">static keyword</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px"><b>static</b> class level pe hota hai, object level pe nahi. Bina object banaye access kar sakte ho &mdash; <code>Math.max()</code> jaisa. Static variable sab objects mein shared hota hai (ek hi copy).</p>
        </div>
    </div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">StaticDemo.java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">Counter</span> {
    <span class="kw">static int</span> count = 0;  <span class="cm">// Shared across ALL objects (ek hi copy)</span>
    String name;

    <span class="fn">Counter</span>(String name) {
        <span class="kw">this</span>.name = name;
        count++;             <span class="cm">// Har object banne pe count badhega</span>
    }

    <span class="kw">static int</span> <span class="fn">getCount</span>() {   <span class="cm">// Static method &mdash; bina object ke call hoga</span>
        <span class="kw">return</span> count;
    }
}

<span class="cm">// Usage</span>
<span class="kw">new</span> Counter(<span class="st">"A"</span>);  <span class="kw">new</span> Counter(<span class="st">"B"</span>);  <span class="kw">new</span> Counter(<span class="st">"C"</span>);
System.out.println(Counter.getCount());  <span class="cm">// Output: 3 (bina object ke call kiya)</span>
    </pre></div>
</div>

<!-- ============ 2. ENCAPSULATION ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Encapsulation &mdash; Data Hiding (Pillar 1)</div>

    <p style="color:#b0bec5;margin-bottom:16px;font-size:1.05em"><strong style="color:#4fc3f7">Encapsulation kya hai?</strong> &mdash; Data (variables) aur methods ko ek class ke andar <b>bundle</b> karna, aur data ko <b>private</b> rakh ke bahar se directly access nahi dena. Getter/Setter se controlled access dete hain &mdash; <em>"Data ko safe rakho, seedha haath mat lagao!"</em></p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div style="background:rgba(79,195,247,.06);border:1px solid rgba(79,195,247,.15);border-radius:12px;padding:16px">
            <strong style="color:#4fc3f7">Real Life Example</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px">ATM machine &mdash; aapko balance dikhata hai (getter), withdraw karne deta hai (setter with validation), lekin <b>andar ka paisa seedha haath nahi laga sakte</b>. Yahi encapsulation hai!</p>
        </div>
        <div style="background:rgba(79,195,247,.06);border:1px solid rgba(79,195,247,.15);border-radius:12px;padding:16px">
            <strong style="color:#4fc3f7">Kyun Zaruri Hai?</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px"><b>1.</b> Data ko invalid values se bachata hai (validation in setter)<br><b>2.</b> Internal implementation change kar sakte ho bina baaki code tode<br><b>3.</b> Read-only ya write-only fields bana sakte ho</p>
        </div>
    </div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Access Modifiers &mdash; Kaun Kahan Access Kar Sakta Hai</div>
    <div style="overflow-x:auto;margin-bottom:16px">
        <table style="width:100%;border-collapse:collapse;font-size:.88em;color:#b0bec5">
            <tr style="background:rgba(79,195,247,.1);color:#4fc3f7;font-weight:700">
                <td style="padding:10px 14px;border:1px solid rgba(79,195,247,.15)">Modifier</td>
                <td style="padding:10px 14px;border:1px solid rgba(79,195,247,.15)">Same Class</td>
                <td style="padding:10px 14px;border:1px solid rgba(79,195,247,.15)">Same Package</td>
                <td style="padding:10px 14px;border:1px solid rgba(79,195,247,.15)">Subclass</td>
                <td style="padding:10px 14px;border:1px solid rgba(79,195,247,.15)">Other Package</td>
            </tr>
            <tr><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#4fc3f7;font-weight:600">public</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#69f0ae">Yes</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#69f0ae">Yes</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#69f0ae">Yes</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#69f0ae">Yes</td></tr>
            <tr><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#4fc3f7;font-weight:600">protected</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#69f0ae">Yes</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#69f0ae">Yes</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#69f0ae">Yes</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#ff5252">No</td></tr>
            <tr><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#4fc3f7;font-weight:600">default</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#69f0ae">Yes</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#69f0ae">Yes</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#ff5252">No</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#ff5252">No</td></tr>
            <tr><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#4fc3f7;font-weight:600">private</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#69f0ae">Yes</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#ff5252">No</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#ff5252">No</td><td style="padding:8px 14px;border:1px solid rgba(79,195,247,.1);color:#ff5252">No</td></tr>
        </table>
    </div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Encapsulation Code Example</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">BankAccount.java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">BankAccount</span> {
    <span class="kw">private</span> String accountNo;    <span class="cm">// Private &mdash; bahar se seedha access nahi</span>
    <span class="kw">private double</span> balance;      <span class="cm">// Private &mdash; data hidden hai</span>

    <span class="cm">// Constructor</span>
    <span class="fn">BankAccount</span>(String accountNo, <span class="tp">double</span> balance) {
        <span class="kw">this</span>.accountNo = accountNo;
        <span class="kw">this</span>.balance = balance;
    }

    <span class="cm">// Getter &mdash; balance dikhata hai (read-only access)</span>
    <span class="kw">public double</span> <span class="fn">getBalance</span>() {
        <span class="kw">return</span> balance;
    }

    <span class="cm">// Setter with validation &mdash; negative deposit nahi hoga</span>
    <span class="kw">public void</span> <span class="fn">deposit</span>(<span class="tp">double</span> amount) {
        <span class="kw">if</span> (amount &lt;= 0) <span class="kw">throw new</span> IllegalArgumentException(<span class="st">"Amount must be positive"</span>);
        <span class="kw">this</span>.balance += amount;
    }

    <span class="cm">// Withdraw with validation &mdash; overdraft nahi hoga</span>
    <span class="kw">public void</span> <span class="fn">withdraw</span>(<span class="tp">double</span> amount) {
        <span class="kw">if</span> (amount &gt; balance) <span class="kw">throw new</span> IllegalArgumentException(<span class="st">"Insufficient balance"</span>);
        <span class="kw">this</span>.balance -= amount;
    }
}

<span class="cm">// Usage</span>
BankAccount acc = <span class="kw">new</span> BankAccount(<span class="st">"ACC001"</span>, 1000);
acc.deposit(500);       <span class="cm">// OK &mdash; balance = 1500</span>
acc.withdraw(200);      <span class="cm">// OK &mdash; balance = 1300</span>
<span class="cm">// acc.balance = -999;  // COMPILE ERROR! private hai &mdash; seedha access nahi milega</span>
    </pre></div>
</div>

<!-- ============ 3. INHERITANCE ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Inheritance &mdash; Code Reuse (Pillar 2)</div>

    <p style="color:#b0bec5;margin-bottom:16px;font-size:1.05em"><strong style="color:#ce93d8">Inheritance kya hai?</strong> &mdash; Ek class (child) dusri class (parent) ki <b>properties aur methods inherit</b> kar sakti hai. Code dobara likhne ki zarurat nahi &mdash; <em>"Baap ke paas jo hai, beta ko bhi milega!"</em></p>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="background:rgba(206,147,216,.06);border:1px solid rgba(206,147,216,.15);border-radius:12px;padding:14px">
            <strong style="color:#ce93d8;font-size:.9em">Single Inheritance</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Ek parent, ek child<br><code>Dog extends Animal</code></p>
        </div>
        <div style="background:rgba(206,147,216,.06);border:1px solid rgba(206,147,216,.15);border-radius:12px;padding:14px">
            <strong style="color:#ce93d8;font-size:.9em">Multilevel Inheritance</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Chain banti hai<br><code>Puppy &rarr; Dog &rarr; Animal</code></p>
        </div>
        <div style="background:rgba(206,147,216,.06);border:1px solid rgba(206,147,216,.15);border-radius:12px;padding:14px">
            <strong style="color:#ce93d8;font-size:.9em">Hierarchical</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Ek parent, multiple children<br><code>Dog, Cat &rarr; Animal</code></p>
        </div>
    </div>

    <div style="background:rgba(255,82,82,.06);border:1px solid rgba(255,82,82,.15);border-radius:12px;padding:14px;margin-bottom:16px">
        <strong style="color:#ff5252">Java mein Multiple Inheritance Classes se NAHI hoti!</strong>
        <p style="color:#b0bec5;font-size:.85em;margin-top:4px">Diamond Problem ki wajah se Java mein ek class do classes ko extend nahi kar sakti. Lekin <b>Interfaces</b> se multiple inheritance achieve hoti hai &mdash; <code>class A implements X, Y</code></p>
    </div>

    <div class="sub-heading" style="color:#ce93d8;border-color:#ce93d8">Inheritance Code &mdash; <code>extends</code> &amp; <code>super</code></div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Inheritance.java</span></div><pre class="code-block">
<span class="cm">// Parent Class (Base / Super class)</span>
<span class="kw">class</span> <span class="cn">Animal</span> {
    String name;
    <span class="tp">int</span> age;

    <span class="fn">Animal</span>(String name, <span class="tp">int</span> age) {
        <span class="kw">this</span>.name = name;
        <span class="kw">this</span>.age = age;
    }

    <span class="kw">void</span> <span class="fn">eat</span>() {
        System.out.println(name + <span class="st">" is eating"</span>);
    }

    <span class="kw">void</span> <span class="fn">sleep</span>() {
        System.out.println(name + <span class="st">" is sleeping"</span>);
    }
}

<span class="cm">// Child Class (Derived / Sub class)</span>
<span class="kw">class</span> <span class="cn">Dog</span> <span class="kw">extends</span> <span class="cn">Animal</span> {
    String breed;

    <span class="fn">Dog</span>(String name, <span class="tp">int</span> age, String breed) {
        <span class="kw">super</span>(name, age);     <span class="cm">// Parent ka constructor call &mdash; pehle parent banega</span>
        <span class="kw">this</span>.breed = breed;
    }

    <span class="cm">// Dog ki apni extra method</span>
    <span class="kw">void</span> <span class="fn">bark</span>() {
        System.out.println(name + <span class="st">" says: Woof! Woof!"</span>);
    }
}

<span class="cm">// Usage</span>
Dog tommy = <span class="kw">new</span> Dog(<span class="st">"Tommy"</span>, 3, <span class="st">"Labrador"</span>);
tommy.eat();    <span class="cm">// Inherited from Animal: "Tommy is eating"</span>
tommy.sleep();  <span class="cm">// Inherited from Animal: "Tommy is sleeping"</span>
tommy.bark();   <span class="cm">// Dog ki apni method: "Tommy says: Woof! Woof!"</span>
    </pre></div>

    <div class="sub-heading" style="color:#ce93d8;border-color:#ce93d8"><code>super</code> Keyword &mdash; Parent Ko Access Karo</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:10px">
        <div style="background:rgba(206,147,216,.06);border:1px solid rgba(206,147,216,.15);border-radius:12px;padding:14px">
            <strong style="color:#ce93d8;font-size:.9em">super()</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Parent ka constructor call karta hai. Child constructor ki <b>pehli line</b> mein hona chahiye.</p>
        </div>
        <div style="background:rgba(206,147,216,.06);border:1px solid rgba(206,147,216,.15);border-radius:12px;padding:14px">
            <strong style="color:#ce93d8;font-size:.9em">super.method()</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Parent ki method call karta hai. Jab child ne override kiya ho lekin parent wali bhi chahiye.</p>
        </div>
        <div style="background:rgba(206,147,216,.06);border:1px solid rgba(206,147,216,.15);border-radius:12px;padding:14px">
            <strong style="color:#ce93d8;font-size:.9em">super.variable</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Parent ki variable access karta hai. Jab child mein same naam ka variable ho (shadowing).</p>
        </div>
    </div>
</div>

<!-- ============ 4. POLYMORPHISM ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">4</span>Polymorphism &mdash; Many Forms (Pillar 3)</div>

    <p style="color:#b0bec5;margin-bottom:16px;font-size:1.05em"><strong style="color:#ffd740">Polymorphism kya hai?</strong> &mdash; Ek hi naam ke method ka <b>alag-alag behavior</b> hona. "Poly" = bahut, "Morph" = forms &mdash; <em>"Ek cheez, lekin kaam alag-alag!"</em></p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div style="background:rgba(255,215,64,.06);border:1px solid rgba(255,215,64,.15);border-radius:12px;padding:16px">
            <strong style="color:#ffd740">Compile-Time (Static)</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px"><b>Method Overloading</b> &mdash; same class mein same naam ke methods, lekin <b>parameters alag</b>. Compiler decide karta hai kaun sa call hoga. Jaise: <code>add(int, int)</code> vs <code>add(double, double)</code></p>
        </div>
        <div style="background:rgba(255,215,64,.06);border:1px solid rgba(255,215,64,.15);border-radius:12px;padding:16px">
            <strong style="color:#ffd740">Run-Time (Dynamic)</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px"><b>Method Overriding</b> &mdash; child class parent ki method ko <b>redefine</b> karti hai. JVM runtime pe decide karta hai kaun si method chalegi &mdash; actual object ke basis pe.</p>
        </div>
    </div>

    <div class="sub-heading" style="color:#ffd740;border-color:#ffd740">Method Overloading (Compile-Time) &mdash; Same Name, Different Params</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Overloading.java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">Calculator</span> {

    <span class="cm">// 2 int ka add</span>
    <span class="tp">int</span> <span class="fn">add</span>(<span class="tp">int</span> a, <span class="tp">int</span> b) {
        <span class="kw">return</span> a + b;
    }

    <span class="cm">// 3 int ka add &mdash; same naam, lekin parameter count alag</span>
    <span class="tp">int</span> <span class="fn">add</span>(<span class="tp">int</span> a, <span class="tp">int</span> b, <span class="tp">int</span> c) {
        <span class="kw">return</span> a + b + c;
    }

    <span class="cm">// double ka add &mdash; same naam, lekin parameter type alag</span>
    <span class="tp">double</span> <span class="fn">add</span>(<span class="tp">double</span> a, <span class="tp">double</span> b) {
        <span class="kw">return</span> a + b;
    }
}

Calculator calc = <span class="kw">new</span> Calculator();
calc.add(2, 3);        <span class="cm">// calls add(int, int) &rarr; 5</span>
calc.add(2, 3, 4);     <span class="cm">// calls add(int, int, int) &rarr; 9</span>
calc.add(2.5, 3.5);    <span class="cm">// calls add(double, double) &rarr; 6.0</span>
    </pre></div>

    <div class="sub-heading" style="color:#ffd740;border-color:#ffd740">Method Overriding (Run-Time) &mdash; Child Redefines Parent's Method</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Overriding.java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">Shape</span> {
    <span class="kw">void</span> <span class="fn">draw</span>() {
        System.out.println(<span class="st">"Drawing a shape"</span>);
    }
}

<span class="kw">class</span> <span class="cn">Circle</span> <span class="kw">extends</span> <span class="cn">Shape</span> {
    <span class="ann">@Override</span>   <span class="cm">// Parent ki method redefine ki</span>
    <span class="kw">void</span> <span class="fn">draw</span>() {
        System.out.println(<span class="st">"Drawing a Circle"</span>);
    }
}

<span class="kw">class</span> <span class="cn">Rectangle</span> <span class="kw">extends</span> <span class="cn">Shape</span> {
    <span class="ann">@Override</span>
    <span class="kw">void</span> <span class="fn">draw</span>() {
        System.out.println(<span class="st">"Drawing a Rectangle"</span>);
    }
}

<span class="cm">// Runtime Polymorphism &mdash; Parent reference, Child object</span>
Shape s1 = <span class="kw">new</span> Circle();      <span class="cm">// Upcasting</span>
Shape s2 = <span class="kw">new</span> Rectangle();
s1.draw();   <span class="cm">// Output: "Drawing a Circle"    &mdash; JVM runtime pe decide karta hai</span>
s2.draw();   <span class="cm">// Output: "Drawing a Rectangle" &mdash; actual object dekh ke</span>
    </pre></div>

    <div style="background:rgba(255,215,64,.06);border:1px solid rgba(255,215,64,.15);border-radius:12px;padding:14px;margin-top:12px">
        <strong style="color:#ffd740">Overloading vs Overriding &mdash; Quick Difference</strong>
        <p style="color:#b0bec5;font-size:.85em;margin-top:6px">
            <b>Overloading:</b> Same class, same name, <b>different params</b> &rarr; compile-time decide hota hai<br>
            <b>Overriding:</b> Parent-child, same name, <b>same params</b> &rarr; runtime pe actual object decide karta hai<br>
            <b>Rule:</b> Overriding mein @Override annotation lagao, return type same ya covariant hona chahiye
        </p>
    </div>
</div>

<!-- ============ 5. ABSTRACTION ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">5</span>Abstraction &mdash; Hide Complexity (Pillar 4)</div>

    <p style="color:#b0bec5;margin-bottom:16px;font-size:1.05em"><strong style="color:#ff5252">Abstraction kya hai?</strong> &mdash; Unnecessary details chhupa ke sirf <b>zaroori cheezein dikhana</b>. User ko pata hona chahiye "kya karta hai", "kaise karta hai" chhupa do &mdash; <em>"Steering dikhao, engine chhupao!"</em></p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div style="background:rgba(255,82,82,.06);border:1px solid rgba(255,82,82,.15);border-radius:12px;padding:16px">
            <strong style="color:#ff5252">Abstract Class (0-100% abstraction)</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px"><b>abstract</b> keyword se banti hai. <b>Abstract + concrete</b> dono methods ho sakti hain. Constructor ho sakta hai. Object nahi ban sakta. Ek hi class extend kar sakte ho.</p>
        </div>
        <div style="background:rgba(255,82,82,.06);border:1px solid rgba(255,82,82,.15);border-radius:12px;padding:16px">
            <strong style="color:#ff5252">Interface (100% abstraction)</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px"><b>interface</b> keyword se banta hai. Sab methods by default <b>abstract</b> hain (Java 8 se default methods bhi). Multiple interfaces implement kar sakte ho. Variables by default <b>public static final</b>.</p>
        </div>
    </div>

    <div class="sub-heading" style="color:#ff5252;border-color:#ff5252">Abstract Class &mdash; Partial Implementation</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">AbstractClass.java</span></div><pre class="code-block">
<span class="cm">// Abstract class &mdash; iska object nahi ban sakta</span>
<span class="kw">abstract class</span> <span class="cn">Vehicle</span> {
    String brand;

    <span class="fn">Vehicle</span>(String brand) {       <span class="cm">// Constructor ho sakta hai</span>
        <span class="kw">this</span>.brand = brand;
    }

    <span class="cm">// Abstract method &mdash; koi body nahi, child ko likhna padega</span>
    <span class="kw">abstract void</span> <span class="fn">start</span>();

    <span class="cm">// Concrete method &mdash; implementation di hui hai, inherit hogi</span>
    <span class="kw">void</span> <span class="fn">stop</span>() {
        System.out.println(brand + <span class="st">" stopped"</span>);
    }
}

<span class="kw">class</span> <span class="cn">Bike</span> <span class="kw">extends</span> <span class="cn">Vehicle</span> {
    <span class="fn">Bike</span>(String brand) { <span class="kw">super</span>(brand); }

    <span class="ann">@Override</span>
    <span class="kw">void</span> <span class="fn">start</span>() {     <span class="cm">// Abstract method ka implementation dena zaroori hai</span>
        System.out.println(brand + <span class="st">" bike started with kick"</span>);
    }
}

<span class="kw">class</span> <span class="cn">Car</span> <span class="kw">extends</span> <span class="cn">Vehicle</span> {
    <span class="fn">Car</span>(String brand) { <span class="kw">super</span>(brand); }

    <span class="ann">@Override</span>
    <span class="kw">void</span> <span class="fn">start</span>() {
        System.out.println(brand + <span class="st">" car started with key"</span>);
    }
}

<span class="cm">// Vehicle v = new Vehicle("X");  // COMPILE ERROR! Abstract class ka object nahi banta</span>
Vehicle v1 = <span class="kw">new</span> Bike(<span class="st">"Honda"</span>);   <span class="cm">// OK &mdash; child ka object ban sakta hai</span>
v1.start();   <span class="cm">// "Honda bike started with kick"</span>
v1.stop();    <span class="cm">// "Honda stopped" (inherited concrete method)</span>
    </pre></div>

    <div class="sub-heading" style="color:#ff5252;border-color:#ff5252">Interface &mdash; Pure Contract (100% Abstraction)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Interface.java</span></div><pre class="code-block">
<span class="cm">// Interface = contract &mdash; "yeh methods tujhe likhne hi padenge"</span>
<span class="kw">interface</span> <span class="iface">Playable</span> {
    <span class="kw">void</span> <span class="fn">play</span>();    <span class="cm">// By default public abstract</span>
    <span class="kw">void</span> <span class="fn">pause</span>();
}

<span class="kw">interface</span> <span class="iface">Recordable</span> {
    <span class="kw">void</span> <span class="fn">record</span>();
}

<span class="cm">// Multiple interfaces implement kar sakte ho &mdash; multiple inheritance!</span>
<span class="kw">class</span> <span class="cn">MusicPlayer</span> <span class="kw">implements</span> <span class="iface">Playable</span>, <span class="iface">Recordable</span> {

    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">play</span>() { System.out.println(<span class="st">"Playing music..."</span>); }

    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">pause</span>() { System.out.println(<span class="st">"Paused"</span>); }

    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">record</span>() { System.out.println(<span class="st">"Recording..."</span>); }
}

<span class="cm">// Java 8+ Default Method &mdash; interface mein body de sakte ho</span>
<span class="kw">interface</span> <span class="iface">Loggable</span> {
    <span class="kw">default void</span> <span class="fn">log</span>(String msg) {
        System.out.println(<span class="st">"LOG: "</span> + msg);  <span class="cm">// Default implementation</span>
    }
}
    </pre></div>

    <div style="background:rgba(255,82,82,.06);border:1px solid rgba(255,82,82,.15);border-radius:12px;padding:14px;margin-top:12px">
        <strong style="color:#ff5252">Abstract Class vs Interface &mdash; Kab Kya Use Karein?</strong>
        <p style="color:#b0bec5;font-size:.85em;margin-top:6px">
            <b>Abstract Class:</b> Jab related classes mein <b>common code share</b> karna ho (partial implementation). Jaise Vehicle &rarr; Car, Bike<br>
            <b>Interface:</b> Jab <b>unrelated classes</b> ko same behavior dena ho (pure contract). Jaise Playable &rarr; MusicPlayer, VideoPlayer<br>
            <b>Rule of thumb:</b> "IS-A" relationship = abstract class. "CAN-DO" capability = interface
        </p>
    </div>
</div>

<!-- ============ 6. FINAL, FINAL KEYWORD ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">6</span>Important Keywords &mdash; final, instanceof, Object Class</div>

    <div class="sub-heading" style="color:#4db6ac;border-color:#4db6ac"><code>final</code> Keyword &mdash; "Ab Isko Badal Nahi Sakte!"</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="background:rgba(77,182,172,.06);border:1px solid rgba(77,182,172,.15);border-radius:12px;padding:14px">
            <strong style="color:#4db6ac;font-size:.9em">final variable</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Constant ban jaata hai, value <b>change nahi hogi</b>.<br><code>final int MAX = 100;</code></p>
        </div>
        <div style="background:rgba(77,182,172,.06);border:1px solid rgba(77,182,172,.15);border-radius:12px;padding:14px">
            <strong style="color:#4db6ac;font-size:.9em">final method</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Child class <b>override nahi kar sakti</b>.<br><code>final void show() {}</code></p>
        </div>
        <div style="background:rgba(77,182,172,.06);border:1px solid rgba(77,182,172,.15);border-radius:12px;padding:14px">
            <strong style="color:#4db6ac;font-size:.9em">final class</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Koi class <b>extend nahi kar sakti</b>. String class final hai!<br><code>final class Utils {}</code></p>
        </div>
    </div>

    <div class="sub-heading" style="color:#4db6ac;border-color:#4db6ac"><code>instanceof</code> &amp; Type Casting</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">InstanceofDemo.java</span></div><pre class="code-block">
Animal animal = <span class="kw">new</span> Dog(<span class="st">"Tommy"</span>, 3, <span class="st">"Lab"</span>);

<span class="cm">// instanceof &mdash; check karta hai ki object kis class ka hai</span>
<span class="kw">if</span> (animal <span class="kw">instanceof</span> Dog) {
    Dog dog = (Dog) animal;    <span class="cm">// Downcasting &mdash; parent reference se child type mein</span>
    dog.bark();                <span class="cm">// Ab child ki method call kar sakte ho</span>
}

<span class="cm">// Java 16+ Pattern Matching &mdash; ek line mein check + cast</span>
<span class="kw">if</span> (animal <span class="kw">instanceof</span> Dog dog) {
    dog.bark();                <span class="cm">// Directly use karo, alag cast nahi chahiye</span>
}
    </pre></div>

    <div class="sub-heading" style="color:#4db6ac;border-color:#4db6ac">Object Class &mdash; Sabka Baap</div>
    <p style="color:#b0bec5;font-size:.92em;margin-bottom:10px">Java mein <b>har class</b> by default <code>Object</code> class ko extend karti hai. Iske important methods:</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="background:rgba(77,182,172,.06);border:1px solid rgba(77,182,172,.15);border-radius:12px;padding:14px">
            <strong style="color:#4db6ac;font-size:.9em">toString()</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Object ka string representation deta hai. Override karo taaki <code>System.out.println(obj)</code> meaningful output de.</p>
        </div>
        <div style="background:rgba(77,182,172,.06);border:1px solid rgba(77,182,172,.15);border-radius:12px;padding:14px">
            <strong style="color:#4db6ac;font-size:.9em">equals() &amp; hashCode()</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Content-based comparison ke liye override karo. HashMap/HashSet mein dono saath override karne padtein hain &mdash; <b>contract</b> hai.</p>
        </div>
    </div>
</div>

<!-- ============ 7. ASSOCIATION, COMPOSITION, AGGREGATION ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">7</span>Association, Aggregation &amp; Composition</div>

    <p style="color:#b0bec5;margin-bottom:16px;font-size:1.05em"><strong style="color:#18ffff">Relationships kya hain?</strong> &mdash; Objects ke beech ka <b>rishta define</b> karna. "HAS-A" relationship &mdash; <em>"Ek cheez ke paas dusri cheez hai!"</em></p>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="background:rgba(24,255,255,.06);border:1px solid rgba(24,255,255,.15);border-radius:12px;padding:14px">
            <strong style="color:#18ffff;font-size:.9em">Association</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Loosest relationship. Dono independently exist karte hain.<br><em>Teacher &harr; Student</em></p>
        </div>
        <div style="background:rgba(24,255,255,.06);border:1px solid rgba(24,255,255,.15);border-radius:12px;padding:14px">
            <strong style="color:#18ffff;font-size:.9em">Aggregation (Weak HAS-A)</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Part independently exist kar sakta hai. Department mein Employee hai, lekin Employee bina Department ke bhi reh sakta hai.</p>
        </div>
        <div style="background:rgba(24,255,255,.06);border:1px solid rgba(24,255,255,.15);border-radius:12px;padding:14px">
            <strong style="color:#18ffff;font-size:.9em">Composition (Strong HAS-A)</strong>
            <p style="color:#b0bec5;font-size:.82em;margin-top:4px">Part independently exist <b>nahi kar sakta</b>. House mein Room hai, House delete = Room bhi delete. <b>Owner ke saath life end.</b></p>
        </div>
    </div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">CompositionVsAggregation.java</span></div><pre class="code-block">
<span class="cm">// COMPOSITION &mdash; Engine bina Car ke exist nahi karega</span>
<span class="kw">class</span> <span class="cn">Engine</span> {
    String type;
    <span class="fn">Engine</span>(String type) { <span class="kw">this</span>.type = type; }
}

<span class="kw">class</span> <span class="cn">Car</span> {
    String brand;
    Engine engine;  <span class="cm">// Composition &mdash; Car ke andar Engine create hota hai</span>

    <span class="fn">Car</span>(String brand) {
        <span class="kw">this</span>.brand = brand;
        <span class="kw">this</span>.engine = <span class="kw">new</span> Engine(<span class="st">"V8"</span>);  <span class="cm">// Car bana = Engine bhi bana (tightly coupled)</span>
    }
    <span class="cm">// Car destroy = Engine bhi destroy (strong ownership)</span>
}

<span class="cm">// AGGREGATION &mdash; Player bina Team ke bhi exist kar sakta hai</span>
<span class="kw">class</span> <span class="cn">Player</span> {
    String name;
    <span class="fn">Player</span>(String name) { <span class="kw">this</span>.name = name; }
}

<span class="kw">class</span> <span class="cn">Team</span> {
    String teamName;
    List&lt;Player&gt; players;  <span class="cm">// Aggregation &mdash; Players bahar se aate hain</span>

    <span class="fn">Team</span>(String name, List&lt;Player&gt; players) {
        <span class="kw">this</span>.teamName = name;
        <span class="kw">this</span>.players = players;  <span class="cm">// Bahar se pass hue (loosely coupled)</span>
    }
    <span class="cm">// Team dissolve = Players still exist (weak ownership)</span>
}
    </pre></div>
</div>

<!-- ============ 8. INTERVIEW CHEAT SHEET ============ -->
<div class="section theme-amber">
    <div class="section-title"><span class="section-num">8</span>Interview Cheat Sheet &mdash; Quick Revision</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div style="background:rgba(255,171,64,.06);border:1px solid rgba(255,171,64,.15);border-radius:12px;padding:16px">
            <strong style="color:#ffab40">4 Pillars of OOPs</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px;line-height:1.8">
                <b style="color:#4fc3f7">1. Encapsulation</b> &mdash; Data hide karo, getter/setter do<br>
                <b style="color:#ce93d8">2. Inheritance</b> &mdash; Code reuse karo, extends use karo<br>
                <b style="color:#ffd740">3. Polymorphism</b> &mdash; Ek method, alag behavior<br>
                <b style="color:#ff5252">4. Abstraction</b> &mdash; Complexity chhupao, simplicity dikhao
            </p>
        </div>
        <div style="background:rgba(255,171,64,.06);border:1px solid rgba(255,171,64,.15);border-radius:12px;padding:16px">
            <strong style="color:#ffab40">Common Interview Questions</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px;line-height:1.8">
                <b>Q:</b> Abstract class vs Interface?<br>
                <b>Q:</b> Why Java doesn't support multiple inheritance?<br>
                <b>Q:</b> Overloading vs Overriding difference?<br>
                <b>Q:</b> Can we override static methods?<br>
                <b>Q:</b> What is diamond problem?<br>
                <b>Q:</b> Composition vs Aggregation?
            </p>
        </div>
    </div>

    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Can constructor be inherited?</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">No! Constructor kabhi inherit nahi hota, super() se call karo</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Can we override private methods?</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">No! Private methods child ko dikhte hi nahi</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Can we override static methods?</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">No! Static methods class level pe hain, method hiding hoti hai (not overriding)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Can abstract class have constructor?</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Yes! Child class super() se call karti hai</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Can interface have variables?</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Yes! But by default public static final (constants only)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Why use @Override annotation?</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Compile-time check &mdash; typo se galat method ban jaaye toh error dega</span></div>
    </div>

    <div class="summary-grid" style="margin-top:20px">
        <div class="summary-card sc-1"><h4>Class &amp; Object</h4><p>Blueprint &amp; Real Instance</p></div>
        <div class="summary-card sc-2"><h4>Encapsulation</h4><p>Private + Getter/Setter</p></div>
        <div class="summary-card sc-3"><h4>Inheritance</h4><p>extends + super()</p></div>
        <div class="summary-card sc-4"><h4>Polymorphism</h4><p>Overloading + Overriding</p></div>
        <div class="summary-card sc-1"><h4>Abstraction</h4><p>Abstract Class + Interface</p></div>
        <div class="summary-card sc-2"><h4>Composition</h4><p>Strong HAS-A (tightly coupled)</p></div>
        <div class="summary-card sc-3"><h4>final keyword</h4><p>Variable, Method, Class lock</p></div>
        <div class="summary-card sc-4"><h4>Object Class</h4><p>toString, equals, hashCode</p></div>
    </div>

    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete <strong style="color:#42a5f5">OOPs in Java</strong> &mdash; Interview ke liye Hinglish mein poori tayyari with code examples.
    </p>
</div>
`
}
