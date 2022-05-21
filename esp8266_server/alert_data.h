typedef struct {

    bool startAlert = false;
    bool tasks[3] = {false, false, false};
    long times[2] = {0, 0};
    int buzTimes = 0;

    void start(){
        const long now = millis();
        this->startAlert = true;
        this->times[0] = now;
        this->times[1] = now;
    }

    void reset(){
        this->startAlert = false;
        this->tasks[0] = false;
        this->tasks[1] = false;
        this->tasks[2] = false;
        this->times[0] = 0;
        this->times[1] = 0;
        this->buzTimes = 0;
    }

    bool isComplete(){
        return this->tasks[0] && this->tasks[1] && this->tasks[2];
    }

} AlertData;